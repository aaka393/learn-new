# Logging setup
$LogPrefix = "[INFO]"
function LogInfo($msg) { Write-Host "$LogPrefix $msg" -ForegroundColor Cyan }
function LogError($msg) { Write-Host "[ERROR] $msg" -ForegroundColor Red }

# Prompt for directory
$DefaultDir = Get-Location
$UseCurrent = Read-Host "Do you want to use the current directory ($DefaultDir) as the base? (Y/N)"
if ($UseCurrent -match '^(y|Y)$') {
    $BasePath = $DefaultDir
} else {
    $CustomPath = Read-Host "Enter full path where you want the project created"
    if (-not (Test-Path $CustomPath)) {
        LogInfo "Creating directory: $CustomPath"
        New-Item -ItemType Directory -Path $CustomPath -Force | Out-Null
    }
    $BasePath = $CustomPath
}

# Ask user to select localhost or custom IP address
$BaseIPChoice = Read-Host "Do you want to use localhost or provide a custom IP address? (Enter 'localhost' or a custom IP address)"
if (-not $BaseIPChoice) {
    $BaseIP = "localhost"
} else {
    $BaseIP = $BaseIPChoice
}

# Config
$SiteName = "site1"
$ProjectPath = Join-Path $BasePath "headless-wp\$SiteName"
$FrontendRoot = Join-Path $ProjectPath "frontend"
$FrontendAppName = "my-react-app"
$FrontendDir = Join-Path $FrontendRoot $FrontendAppName
$DockerComposePath = Join-Path $ProjectPath "docker-compose.yml"
$Utf8NoBom = New-Object System.Text.UTF8Encoding $false

try {
    LogInfo "Starting setup for Headless WordPress..."

    # Create structure
    LogInfo "Creating project structure..."
    New-Item -ItemType Directory -Path "$FrontendRoot" -Force | Out-Null
    New-Item -ItemType Directory -Path "$ProjectPath\data\db" -Force | Out-Null
    New-Item -ItemType Directory -Path "$ProjectPath\data\wp_content" -Force | Out-Null

    # Docker Compose
    $DockerCompose = @"
version: "3.8"
services:
  wordpress:
    image: wordpress:latest
    container_name: ${SiteName}_wordpress
    restart: always
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: user
      WORDPRESS_DB_PASSWORD: password
      WORDPRESS_DB_NAME: wordpress
      WP_HOME: http://${BaseIP}:8001
      WP_SITEURL: http://${BaseIP}:8001
    volumes:
      - ./data/wp_content:/var/www/html
    ports:
      - "8001:80"
    depends_on:
      - db

  db:
    image: mysql:5.7
    container_name: ${SiteName}_db
    restart: always
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: user
      MYSQL_PASSWORD: password
      MYSQL_ROOT_PASSWORD: rootpass
    volumes:
      - ./data/db:/var/lib/mysql

  nginx:
    image: nginx:latest
    container_name: ${SiteName}_nginx
    ports:
      - "8080:80"
    volumes:
      - ./frontend/${FrontendAppName}/dist:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - wordpress
"@
    [System.IO.File]::WriteAllText($DockerComposePath, $DockerCompose, $Utf8NoBom)
    LogInfo "Docker Compose file created."
    
    # Nginx Config
    $NginxConf = @"
server {
    listen 80;
    server_name $BaseIP;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files `$uri /index.html;
    }

    location /wp-json/ {
        proxy_pass http://site1_wordpress:80;
    }

    location /wp-admin/ {
        proxy_pass http://site1_wordpress:80;
    }

    location ~ ^/wp-(admin|content|includes)/ {
        proxy_pass http://site1_wordpress:80;
    }

    location ~ \.php$ {
        proxy_pass http://site1_wordpress:80;
        include fastcgi_params;
    }
}
"@
    [System.IO.File]::WriteAllText("$ProjectPath\nginx.conf", $NginxConf, $Utf8NoBom)
    LogInfo "Nginx config created."

    # React App
    LogInfo "Creating React app using Vite..."
    Push-Location $FrontendRoot
    npx create-vite $FrontendAppName --template react-ts --yes
    Push-Location $FrontendDir

    # Update App.tsx
    LogInfo "Updating App.tsx to fetch posts from WordPress..."
    $AppTsxPath = "$FrontendDir\src\App.tsx"
    $retries = 0
    while (-not (Test-Path $AppTsxPath) -and $retries -lt 10) {
        Start-Sleep -Seconds 1
        $retries++
    }

    if (-not (Test-Path $AppTsxPath)) {
        throw "❌ App.tsx not found at $AppTsxPath. React project creation might have failed."
    }

    $AppTsx = @"
import React, { useEffect, useState } from 'react';

interface Post {
  id: number;
  title: {
    rendered: string;
  };
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://${BaseIP}:8001/wp-json/wp/v2/posts");
        if (!response.ok) {
          throw new Error("HTTP error! status: " + response.status);
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title.rendered}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
"@
    [System.IO.File]::WriteAllText($AppTsxPath, $AppTsx, $Utf8NoBom)

    LogInfo "Running npm install..."
    npm install

    LogInfo "Building React app..."
    npm run build

    Pop-Location; Pop-Location

    # Start Docker
    LogInfo "Starting Docker containers..."
    docker compose -f "$DockerComposePath" up -d

    LogInfo "✅ Setup complete. Access WordPress at http://${BaseIP}:8001 and React at http://${BaseIP}:8080"

} catch {
    LogError "An error occurred: $_"
}