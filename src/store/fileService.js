// Mock file system service
class FileService {
  constructor() {
    this.fileSystem = JSON.parse(localStorage.getItem('fileSystem') || '{}');
    this.initializeDefaultStructure();
  }

  // Initialize default file system structure
  initializeDefaultStructure() {
    if (!this.fileSystem['/']) {
      this.fileSystem = {
        '/': {
          type: 'directory',
          children: {
            'home': {
              type: 'directory',
              children: {}
            },
            'etc': {
              type: 'directory',
              children: {}
            },
            'var': {
              type: 'directory',
              children: {}
            },
            'tmp': {
              type: 'directory',
              children: {}
            }
          }
        }
      };
      this.saveFileSystem();
    }
  }

  // Save file system to localStorage
  saveFileSystem() {
    localStorage.setItem('fileSystem', JSON.stringify(this.fileSystem));
  }

  // Get current directory contents
  listDirectory(path = '/') {
    const pathParts = this.normalizePath(path).split('/').filter(p => p);
    let current = this.fileSystem['/'];

    for (const part of pathParts) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return { success: false, message: `Directory not found: ${path}` };
      }
    }

    if (current.type !== 'directory') {
      return { success: false, message: `Not a directory: ${path}` };
    }

    const contents = Object.keys(current.children || {}).map(name => ({
      name,
      type: current.children[name].type,
      size: current.children[name].size || 0
    }));

    return { success: true, contents };
  }

  // Create directory
  createDirectory(path, name) {
    const dirPath = this.normalizePath(`${path}/${name}`);
    const pathParts = dirPath.split('/').filter(p => p);
    
    let current = this.fileSystem['/'];
    const parentPath = pathParts.slice(0, -1);
    const dirName = pathParts[pathParts.length - 1];

    // Navigate to parent directory
    for (const part of parentPath) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return { success: false, message: `Parent directory not found` };
      }
    }

    // Check if directory already exists
    if (current.children && current.children[dirName]) {
      return { success: false, message: `Directory already exists: ${name}` };
    }

    // Create directory
    if (!current.children) current.children = {};
    current.children[dirName] = {
      type: 'directory',
      children: {}
    };

    this.saveFileSystem();
    return { success: true, message: `Directory created: ${name}` };
  }

  // Remove directory
  removeDirectory(path, name) {
    const dirPath = this.normalizePath(`${path}/${name}`);
    const pathParts = dirPath.split('/').filter(p => p);
    
    let current = this.fileSystem['/'];
    const parentPath = pathParts.slice(0, -1);
    const dirName = pathParts[pathParts.length - 1];

    // Navigate to parent directory
    for (const part of parentPath) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return { success: false, message: `Parent directory not found` };
      }
    }

    // Check if directory exists
    if (!current.children || !current.children[dirName]) {
      return { success: false, message: `Directory not found: ${name}` };
    }

    // Check if directory is empty
    if (current.children[dirName].children && Object.keys(current.children[dirName].children).length > 0) {
      return { success: false, message: `Directory not empty: ${name}` };
    }

    // Remove directory
    delete current.children[dirName];
    this.saveFileSystem();
    return { success: true, message: `Directory removed: ${name}` };
  }

  // Create file
  createFile(path, name, content = '') {
    const filePath = this.normalizePath(`${path}/${name}`);
    const pathParts = filePath.split('/').filter(p => p);
    
    let current = this.fileSystem['/'];
    const parentPath = pathParts.slice(0, -1);
    const fileName = pathParts[pathParts.length - 1];

    // Navigate to parent directory
    for (const part of parentPath) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return { success: false, message: `Parent directory not found` };
      }
    }

    // Check if file already exists
    if (current.children && current.children[fileName]) {
      return { success: false, message: `File already exists: ${name}` };
    }

    // Create file
    if (!current.children) current.children = {};
    current.children[fileName] = {
      type: 'file',
      content: content,
      size: content.length
    };

    this.saveFileSystem();
    return { success: true, message: `File created: ${name}` };
  }

  // Read file content
  readFile(path, name) {
    const filePath = this.normalizePath(`${path}/${name}`);
    const pathParts = filePath.split('/').filter(p => p);
    
    let current = this.fileSystem['/'];

    for (const part of pathParts) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return { success: false, message: `File not found: ${name}` };
      }
    }

    if (current.type !== 'file') {
      return { success: false, message: `Not a file: ${name}` };
    }

    return { success: true, content: current.content };
  }

  // Write file content
  writeFile(path, name, content) {
    const filePath = this.normalizePath(`${path}/${name}`);
    const pathParts = filePath.split('/').filter(p => p);
    
    let current = this.fileSystem['/'];

    for (const part of pathParts) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return { success: false, message: `File not found: ${name}` };
      }
    }

    if (current.type !== 'file') {
      return { success: false, message: `Not a file: ${name}` };
    }

    current.content = content;
    current.size = content.length;
    this.saveFileSystem();
    return { success: true, message: `File updated: ${name}` };
  }

  // Remove file
  removeFile(path, name) {
    const filePath = this.normalizePath(`${path}/${name}`);
    const pathParts = filePath.split('/').filter(p => p);

    let current = this.fileSystem['/'];
    const parentPath = pathParts.slice(0, -1);
    const fileName = pathParts[pathParts.length - 1];

    for (const part of parentPath) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return { success: false, message: `Parent directory not found` };
      }
    }

    if (!current.children || !current.children[fileName]) {
      return { success: false, message: `File not found: ${name}` };
    }

    if (current.children[fileName].type !== 'file') {
      return { success: false, message: `Not a file: ${name}` };
    }

    delete current.children[fileName];
    this.saveFileSystem();
    return { success: true, message: `File removed: ${name}` };
  }

  // Normalize path
  normalizePath(path) {
    if (path === '' || path === '.') return '/';
    if (!path.startsWith('/')) path = '/' + path;
    return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  }

  // Get current working directory
  getCurrentDirectory() {
    return this.currentDirectory || '/';
  }

  // Set current working directory
  setCurrentDirectory(path) {
    this.currentDirectory = this.normalizePath(path);
  }

  // Change directory
  changeDirectory(path) {
    const normalizedPath = this.normalizePath(path);
    const pathParts = normalizedPath.split('/').filter(p => p);
    
    let current = this.fileSystem['/'];

    for (const part of pathParts) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return { success: false, message: `Directory not found: ${path}` };
      }
    }

    if (current.type !== 'directory') {
      return { success: false, message: `Not a directory: ${path}` };
    }

    this.setCurrentDirectory(normalizedPath);
    return { success: true, path: normalizedPath };
  }
}

export default new FileService();