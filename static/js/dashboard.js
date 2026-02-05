// Tab switching functionality
function switchTab(tabId) {
    // Hide all tab panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab pane
    const selectedPane = document.getElementById(tabId);
    if (selectedPane) {
        selectedPane.classList.add('active');
    }
    
    // Activate corresponding button
    const activeButton = Array.from(tabButtons).find(button => 
        button.getAttribute('onclick').includes(tabId)
    );
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Store active tab in localStorage
    localStorage.setItem('activeTab', tabId);
    
    // Update filter status display when switching to training tab
    if (tabId === 'model-training') {
        updateTrainingFilterDisplay();
    }
}

// Global variable to store active training filters
let activeTrainingFilters = null;

// Update the training filter display
function updateTrainingFilterDisplay() {
    const statusDiv = document.getElementById('activeFilterStatus');
    const descDiv = document.getElementById('activeFilterDescription');
    
    if (activeTrainingFilters && activeTrainingFilters.length > 0) {
        const filterDesc = activeTrainingFilters.map(f => 
            `<strong>${f.attribute.replace(/_/g, ' ')}</strong> = ${f.value === 1 ? 'Present' : 'Absent'}`
        ).join(' AND ');
        
        descDiv.innerHTML = `
            <p style="margin: 0 0 5px 0;">Models will be trained on filtered dataset:</p>
            <p style="margin: 0; font-weight: 500;">${filterDesc}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #777;">
                (Filters applied from Visualization tab)
            </p>
        `;
        statusDiv.style.display = 'block';
    } else {
        statusDiv.style.display = 'none';
    }
}

// Clear training filters
function clearTrainingFilters() {
    activeTrainingFilters = null;
    updateTrainingFilterDisplay();
    alert('✓ Filters cleared. Models will now train on the full dataset.');
}

// Status refresh interval
let statusInterval;

// Restore active tab on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
        switchTab(savedTab);
    }
    
    // Start automatic status refresh
    refreshStatus();
    statusInterval = setInterval(refreshStatus, 180000); // Refresh every 3 minutes
});

function queueModel(modelName) {
    const config = {};
    
    if (modelName === 'VAE') {
        config.latent_dim = parseInt(document.getElementById('vae_latent_dim').value);
        config.num_epochs = parseInt(document.getElementById('vae_epochs').value);
        config.learning_rate = parseFloat(document.getElementById('vae_lr').value);
        config.batch_size = parseInt(document.getElementById('vae_batch_size').value);
    } else if (modelName === 'Beta-VAE') {
        config.latent_dim = parseInt(document.getElementById('betavae_latent_dim').value);
        config.num_epochs = parseInt(document.getElementById('betavae_epochs').value);
        config.learning_rate = parseFloat(document.getElementById('betavae_lr').value);
        config.batch_size = parseInt(document.getElementById('betavae_batch_size').value);
        config.beta = parseFloat(document.getElementById('betavae_beta').value);
    } else if (modelName === 'DCGAN') {
        config.latent_dim = parseInt(document.getElementById('dcgan_latent_dim').value);
        config.num_epochs = parseInt(document.getElementById('dcgan_epochs').value);
        config.learning_rate = parseFloat(document.getElementById('dcgan_lr').value);
        config.batch_size = parseInt(document.getElementById('dcgan_batch_size').value);
    } else if (modelName === 'VQ-VAE') {
        config.codebook_size = parseInt(document.getElementById('vqvae_codebook_size').value);
        config.num_epochs = parseInt(document.getElementById('vqvae_epochs').value);
        config.learning_rate = parseFloat(document.getElementById('vqvae_lr').value);
        config.batch_size = parseInt(document.getElementById('vqvae_batch_size').value);
    }
    
    // Add active filters to config
    if (activeTrainingFilters && activeTrainingFilters.length > 0) {
        config.filters = activeTrainingFilters;
        console.log('Adding filters to training config:', activeTrainingFilters);
    }
    
    fetch('/queue_model', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({model_name: modelName, config: config})
    })
    .then(response => response.json())
    .then(data => {
        const filterMsg = activeTrainingFilters && activeTrainingFilters.length > 0 
            ? ' (with filters)' 
            : '';
        alert(`${modelName} added to queue${filterMsg}! Job ID: ${data.job_id}`);
        // Status will be refreshed automatically by the interval
    });
}

function visualizeData(vizType) {
    const vizStatus = document.getElementById('vizStatus');
    vizStatus.style.display = 'block';
    vizStatus.innerHTML = '⏳ Loading visualization...';
    
    fetch('/visualize', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({viz_type: vizType})
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            vizStatus.innerHTML = `✅ ${data.message}`;
        } else {
            vizStatus.innerHTML = `❌ Error: ${data.message}`;
        }
    })
    .catch(error => {
        vizStatus.innerHTML = `❌ Error: ${error}`;
    });
}

function startQueue() {
    fetch('/start_queue', {method: 'POST'})
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // Status will be refreshed automatically by the interval
        });
}

function stopQueue() {
    fetch('/stop_queue', {method: 'POST'})
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // Status will be refreshed automatically by the interval
        });
}

function showExitModal() {
    document.getElementById('exitModal').style.display = 'block';
}

function closeExitModal() {
    document.getElementById('exitModal').style.display = 'none';
}

function restartDashboard() {
    if (confirm('Are you sure you want to restart the dashboard? This will reload the page.')) {
        // Show restarting message
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <div style="background: white; padding: 50px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px;">
                    <h2 style="color: #667eea; margin-bottom: 20px;">🔄 Restarting Dashboard...</h2>
                    <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
                        The dashboard is being restarted.<br>
                        Please wait a moment...
                    </p>
                    <div style="font-size: 48px; margin: 20px 0;">⏳</div>
                </div>
            </div>
        `;
        
        // Send restart request
        fetch('/restart', {method: 'POST'})
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                // Wait a bit then reload
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch(error => {
                console.log('Restart initiated');
                // Reload anyway after a delay
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
    }
}

function exitApplication() {
    // Stop refreshing status
    clearInterval(statusInterval);
    
    // Show exit message
    document.body.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="background: white; padding: 50px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 500px;">
                <h2 style="color: #667eea; margin-bottom: 20px;">✅ Shutting Down Gracefully</h2>
                <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
                    The dashboard is being shut down safely.<br>
                    All training processes have been stopped.<br><br>
                    <strong>You can now close this window.</strong>
                </p>
                <div style="font-size: 48px; margin: 20px 0;">👋</div>
                <p style="color: #999; font-size: 14px;">Thank you for using the Generative Models Dashboard!</p>
            </div>
        </div>
    `;
    
    // Send shutdown request
    fetch('/shutdown', {method: 'POST'})
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
        })
        .catch(error => {
            console.log('Server shutdown initiated');
        });
}

function refreshStatus() {
    fetch('/status')
        .then(response => response.json())
        .then(data => {
            const statusDiv = document.getElementById('queueStatus');
            let html = '<p><strong>Status:</strong> ' + (data.is_running ? '🟢 Running' : '🔴 Stopped') + '</p>';
            html += '<p><strong>Queue Size:</strong> ' + data.queue_size + '</p>';
            html += '<p><strong>Completed Jobs:</strong> ' + data.completed_jobs + '</p>';
            
            if (data.current_job) {
                html += '<p><strong>Current Job:</strong> ' + data.current_job.model_name + ' (' + data.current_job.status + ')</p>';
            }
            
            statusDiv.innerHTML = html;
        })
        .catch(error => {
            // Server might be shutting down
            console.log('Status update failed:', error);
        });
}

function refreshComparison() {
    const statusDiv = document.getElementById('comparisonStatus');
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '⏳ Computing model comparisons...';
    
    fetch('/refresh_comparison', {method: 'POST'})
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                statusDiv.innerHTML = '✅ ' + data.message;
                
                // Update the table with new data
                const tbody = document.querySelector('#comparisonTable tbody');
                tbody.innerHTML = '';
                
                data.comparisons.forEach(model => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><strong>${model.name}</strong></td>
                        <td>${model.type}</td>
                        <td>${model.latent_space}</td>
                        <td><span class="rating">${model.quality}</span></td>
                        <td><span class="rating">${model.diversity}</span></td>
                        <td><span class="rating">${model.control}</span></td>
                        <td><span class="rating">${model.training_speed}</span></td>
                    `;
                    tbody.appendChild(row);
                });
                
                // Hide status after 3 seconds
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 3000);
            } else {
                statusDiv.innerHTML = '❌ Error: ' + data.message;
            }
        })
        .catch(error => {
            statusDiv.innerHTML = '❌ Error: ' + error;
        });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('exitModal');
    if (event.target == modal) {
        closeExitModal();
    }
}
// CelebA Attributes
const celebaAttributes = [
    '5_o_Clock_Shadow', 'Arched_Eyebrows', 'Attractive', 'Bags_Under_Eyes', 'Bald',
    'Bangs', 'Big_Lips', 'Big_Nose', 'Black_Hair', 'Blond_Hair', 'Blurry', 'Brown_Hair',
    'Bushy_Eyebrows', 'Chubby', 'Double_Chin', 'Eyeglasses', 'Goatee', 'Gray_Hair',
    'Heavy_Makeup', 'High_Cheekbones', 'Male', 'Mouth_Slightly_Open', 'Mustache',
    'Narrow_Eyes', 'No_Beard', 'Oval_Face', 'Pale_Skin', 'Pointy_Nose', 'Receding_Hairline',
    'Rosy_Cheeks', 'Sideburns', 'Smiling', 'Straight_Hair', 'Wavy_Hair', 'Wearing_Earrings',
    'Wearing_Hat', 'Wearing_Lipstick', 'Wearing_Necklace', 'Wearing_Necktie', 'Young'
];

let filterRowCounter = 0;

function addFilterRow() {
    const tbody = document.getElementById('filterTableBody');
    const row = document.createElement('tr');
    row.id = `filter-row-${filterRowCounter}`;
    
    // Get already selected attributes
    const selectedAttributes = getSelectedAttributes();
    
    // Filter available attributes
    const availableAttributes = celebaAttributes.filter(attr => !selectedAttributes.includes(attr));
    
    if (availableAttributes.length === 0) {
        alert('All attributes have been added to the filter!');
        return;
    }
    
    row.innerHTML = `
        <td>
            <select class="attribute-select" onchange="updateAvailableAttributes()">
                <option value="">-- Select Attribute --</option>
                ${availableAttributes.map(attr => `<option value="${attr}">${attr.replace(/_/g, ' ')}</option>`).join('')}
            </select>
        </td>
        <td>
            <select class="value-select">
                <option value="1">Present (1)</option>
                <option value="0">Absent (0)</option>
            </select>
        </td>
        <td>
            <button class="remove-row-btn" onclick="removeFilterRow('filter-row-${filterRowCounter}')">Remove</button>
        </td>
    `;
    
    tbody.appendChild(row);
    filterRowCounter++;
}

function removeFilterRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.remove();
        updateAvailableAttributes();
    }
}

function getSelectedAttributes() {
    const selects = document.querySelectorAll('.attribute-select');
    const selected = [];
    selects.forEach(select => {
        if (select.value) {
            selected.push(select.value);
        }
    });
    return selected;
}

function updateAvailableAttributes() {
    const selectedAttributes = getSelectedAttributes();
    const selects = document.querySelectorAll('.attribute-select');
    
    selects.forEach(select => {
        const currentValue = select.value;
        const availableAttributes = celebaAttributes.filter(attr => 
            !selectedAttributes.includes(attr) || attr === currentValue
        );
        
        // Rebuild options
        const options = ['<option value="">-- Select Attribute --</option>'];
        availableAttributes.forEach(attr => {
            const selected = attr === currentValue ? 'selected' : '';
            options.push(`<option value="${attr}" ${selected}>${attr.replace(/_/g, ' ')}</option>`);
        });
        select.innerHTML = options.join('');
    });
}

function applyFilters() {
    const rows = document.querySelectorAll('#filterTableBody tr');
    
    if (rows.length === 0) {
        alert('Please add at least one filter row!');
        return;
    }
    
    const filters = [];
    let hasEmptyAttribute = false;
    
    rows.forEach((row, index) => {
        const attribute = row.querySelector('.attribute-select').value;
        const value = row.querySelector('.value-select').value;
        
        if (!attribute) {
            hasEmptyAttribute = true;
            return;
        }
        
        filters.push({
            attribute: attribute,
            value: parseInt(value)
        });
    });
    
    if (hasEmptyAttribute) {
        alert('Please select an attribute for all filter rows!');
        return;
    }
    
    if (filters.length === 0) {
        alert('Please add at least one valid filter!');
        return;
    }
    
    // Show loading status with filter details
    const statusDiv = document.getElementById('vizStatus');
    statusDiv.style.display = 'block';
    
    // Display applied filters
    const filterDesc = filters.map(f => `${f.attribute.replace(/_/g, ' ')} = ${f.value === 1 ? 'Present' : 'Absent'}`).join(' AND ');
    statusDiv.innerHTML = `🔄 Applying filters: <strong>${filterDesc}</strong><br>Loading images...`;
    
    // Log filters being sent
    console.log('Sending filters to backend:', filters);
    
    // Send request to backend
    fetch('/api/filter_faces', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filters: filters })
    })
    .then(response => {
        // Check if response is OK and is JSON
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Server error: ${response.status} - ${text.substring(0, 100)}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Backend response:', data);
        if (data.status === 'success') {
            const filterDesc = filters.map(f => `${f.attribute.replace(/_/g, ' ')} = ${f.value === 1 ? 'Present' : 'Absent'}`).join(' AND ');
            displayFilteredResults(data.images, data.count, filterDesc);
            statusDiv.innerHTML = `✅ Found ${data.count} matching faces with filters: <strong>${filterDesc}</strong>`;
            
            // Store filters for training
            activeTrainingFilters = filters;
            console.log('Stored filters for training:', activeTrainingFilters);
            
            // Show notification
            setTimeout(() => {
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #4caf50;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 10000;
                    font-weight: 500;
                `;
                notification.innerHTML = '✓ Filters saved! Go to Model Training tab to train with this filtered dataset.';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.transition = 'opacity 0.5s';
                    notification.style.opacity = '0';
                    setTimeout(() => notification.remove(), 500);
                }, 3000);
            }, 100);
            
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        } else {
            statusDiv.innerHTML = '❌ Error: ' + (data.message || 'Unknown error');
            if (data.traceback) {
                console.error('Server traceback:', data.traceback);
            }
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        statusDiv.innerHTML = '❌ Error: ' + error.message;
    });
}

function displayFilteredResults(images, count, filterDescription) {
    const outputDiv = document.getElementById('filterOutput');
    const gridDiv = document.getElementById('filterResultsGrid');
    
    outputDiv.style.display = 'block';
    
    // Clear and add filter description
    gridDiv.innerHTML = '';
    
    if (filterDescription) {
        const filterInfo = document.createElement('div');
        filterInfo.style.cssText = 'padding: 15px; margin-bottom: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
        
        // Get the filters from the UI to display details
        const rows = document.querySelectorAll('#filterTableBody tr');
        const filterDetails = [];
        rows.forEach(row => {
            const attribute = row.querySelector('.attribute-select').value;
            const value = row.querySelector('.value-select').value;
            if (attribute) {
                filterDetails.push({
                    attr: attribute,
                    val: value
                });
            }
        });
        
        // Build detailed filter list
        let detailsHTML = '';
        if (filterDetails.length > 0) {
            detailsHTML = '<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3);">';
            detailsHTML += '<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">Filter Details:</p>';
            detailsHTML += '<ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8;">';
            filterDetails.forEach((f, index) => {
                const displayName = f.attr.replace(/_/g, ' ');
                const displayValue = f.val === '1' ? 'Present (1)' : 'Absent (0)';
                detailsHTML += `<li><strong>${displayName}</strong>: ${displayValue}</li>`;
            });
            detailsHTML += '</ul>';
            detailsHTML += '</div>';
        }
        
        filterInfo.innerHTML = `
            <h4 style="margin: 0 0 10px 0; font-size: 18px;">🔍 Applied Filters</h4>
            <p style="margin: 0; font-size: 16px;"><strong>${filterDescription}</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Found ${count} matching faces (showing first ${images ? images.length : 0})</p>
            ${detailsHTML}
        `;
        gridDiv.appendChild(filterInfo);
    }
    
    if (!images || images.length === 0) {
        const noResults = document.createElement('p');
        noResults.style.cssText = 'padding: 20px; text-align: center; color: #666;';
        noResults.textContent = 'No images match the specified filters.';
        gridDiv.appendChild(noResults);
        return;
    }
    
    // Create image grid container
    const imageGrid = document.createElement('div');
    imageGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px;';
    
    images.forEach(imgData => {
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${imgData}`;
        img.alt = 'Filtered face';
        img.style.cssText = 'width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);';
        imageGrid.appendChild(img);
    });
    
    gridDiv.appendChild(imageGrid);
}

function clearFilters() {
    const tbody = document.getElementById('filterTableBody');
    tbody.innerHTML = '';
    filterRowCounter = 0;
    
    // Also clear training filters
    activeTrainingFilters = null;
    updateTrainingFilterDisplay();
    
    const statusDiv = document.getElementById('vizStatus');
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '✅ Filters cleared! (Both visualization and training filters)';
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 2000);
}

function clearOutput() {
    const outputDiv = document.getElementById('filterOutput');
    const gridDiv = document.getElementById('filterResultsGrid');
    
    outputDiv.style.display = 'none';
    gridDiv.innerHTML = '';
    
    const statusDiv = document.getElementById('vizStatus');
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '✅ Output cleared!';
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 2000);
}