# Dashboard Code Structure

The web dashboard code has been refactored to separate HTML, CSS, and JavaScript into individual files for better maintainability and organization.

## File Structure

```
ADL-Assignment2/
├── face_modification.ipynb        # Main notebook with Python code
├── templates/
│   └── dashboard.html            # HTML template for the dashboard
└── static/
    ├── css/
    │   └── dashboard.css         # Dashboard styles
    └── js/
        └── dashboard.js          # Dashboard JavaScript functionality
```

## Changes Made

### 1. **HTML Separation** (`templates/dashboard.html`)
   - Contains the complete dashboard UI structure
   - Uses Flask's Jinja2 templating system
   - Links to external CSS and JavaScript files using `url_for()`

### 2. **CSS Separation** (`static/css/dashboard.css`)
   - All dashboard styling moved to external CSS file
   - Includes responsive design, animations, and theming
   - Easier to maintain and modify visual appearance

### 3. **JavaScript Separation** (`static/js/dashboard.js`)
   - All client-side logic moved to external JS file
   - Includes:
     - Model queue management functions
     - Data visualization requests
     - Status updates and polling
     - Modal controls
     - Dashboard restart/exit functionality

### 4. **Python Code** (`face_modification.ipynb` - Cell 19)
   - Updated Flask import from `render_template_string` to `render_template`
   - Removed inline `HTML_TEMPLATE` variable (~700 lines)
   - Flask routes now use external templates:
     ```python
     @app.route('/')
     def index():
         return render_template('dashboard.html')
     ```

## Benefits

1. **Better Code Organization**: Separation of concerns (Python, HTML, CSS, JS)
2. **Easier Maintenance**: Each file has a single responsibility
3. **Improved Readability**: No more huge inline strings in Python code
4. **Better IDE Support**: Proper syntax highlighting and autocompletion for each file type
5. **Version Control**: Easier to track changes in individual files
6. **Reusability**: Templates and assets can be reused or extended

## Usage

The dashboard works exactly as before, but with cleaner code structure:

```python
# Start the dashboard (from the notebook)
start_dashboard(port=6060, open_browser=True)

# Stop the dashboard
stop_dashboard()

# Restart the dashboard
restart_dashboard(port=6060)
```

## Flask Directory Structure

Flask automatically looks for:
- Templates in the `templates/` directory
- Static files in the `static/` directory

The `static/` folder structure allows organizing assets by type (css, js, images, etc.).
