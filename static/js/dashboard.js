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
}

// Restore active tab on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
        switchTab(savedTab);
    }
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
    
    fetch('/queue_model', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({model_name: modelName, config: config})
    })
    .then(response => response.json())
    .then(data => {
        alert(`${modelName} added to queue! Job ID: ${data.job_id}`);
        refreshStatus();
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
            refreshStatus();
        });
}

function stopQueue() {
    fetch('/stop_queue', {method: 'POST'})
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            refreshStatus();
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

// Refresh status every 1 minute (60 seconds)
const statusInterval = setInterval(refreshStatus, 60000);
refreshStatus();

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
            <select class="boolean-select">
                <option value="AND">AND</option>
                <option value="OR">OR</option>
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
        const boolean = row.querySelector('.boolean-select').value;
        
        if (!attribute) {
            hasEmptyAttribute = true;
            return;
        }
        
        filters.push({
            attribute: attribute,
            value: parseInt(value),
            boolean: index < rows.length - 1 ? boolean : null // Ignore last row boolean
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
    
    // Show loading status
    const statusDiv = document.getElementById('vizStatus');
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '🔄 Applying filters and loading images...';
    
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
        if (data.status === 'success') {
            displayFilteredResults(data.images, data.count);
            statusDiv.innerHTML = `✅ Found ${data.count} matching faces!`;
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
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

function displayFilteredResults(images, count) {
    const outputDiv = document.getElementById('filterOutput');
    const gridDiv = document.getElementById('filterResultsGrid');
    
    outputDiv.style.display = 'block';
    gridDiv.innerHTML = '';
    
    if (!images || images.length === 0) {
        gridDiv.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">No images match the specified filters.</p>';
        return;
    }
    
    images.forEach(imgData => {
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${imgData}`;
        img.alt = 'Filtered face';
        gridDiv.appendChild(img);
    });
}

function clearFilters() {
    const tbody = document.getElementById('filterTableBody');
    tbody.innerHTML = '';
    filterRowCounter = 0;
    
    const statusDiv = document.getElementById('vizStatus');
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '✅ Filters cleared!';
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