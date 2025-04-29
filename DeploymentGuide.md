# Digital Twin Application Deployment Guide for Fly.io

This guide walks you through deploying the Digital Twin Application to Fly.io, a platform for running full-stack apps and databases close to your users.

## Prerequisites

Before you begin, make sure you have the following:

1. **The Digital Twin Application codebase** (React.js application)
2. **Node.js** installed on your local machine (version 16 or later recommended)
3. **Git** for version control
4. **Fly.io account** (sign up at [fly.io](https://fly.io/))
5. **Fly CLI** installed on your machine

## Step 1: Install the Fly CLI

```bash
# For macOS
brew install flyctl

# For Windows - using PowerShell
iwr https://fly.io/install.ps1 -useb | iex

# For Linux
curl -L https://fly.io/install.sh | sh
```

## Step 2: Authenticate with Fly.io

```bash
fly auth login
```

This will open a browser window where you can log in to your Fly.io account.

## Step 3: Prepare Your Application

### 1. Create a Dockerfile

Create a file named `Dockerfile` in the root of your project:

```dockerfile
# Build stage
FROM node:19-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Add nginx configuration to properly handle React Router
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. Create Nginx Configuration

Create the directory `nginx` in your project root and a file inside called `nginx.conf`:

```
mkdir -p nginx
```

Create the `nginx/nginx.conf` file:

```
server {
    listen 80;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        root /usr/share/nginx/html;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }
    
    # Handle error 404
    error_page 404 /index.html;
}
```

### 3. Create .dockerignore File

Create a `.dockerignore` file in the root of your project:

```
node_modules
npm-debug.log
build
.git
.github
.gitignore
README.md
```

## Step 4: Initialize Your Fly.io Application

Run the following command in your project directory:

```bash
fly launch
```

This will:
1. Ask for an app name (must be unique across Fly.io)
2. Ask which region to deploy to (choose the region closest to your users)
3. Ask if you want to set up a PostgreSQL database (you can choose "No" for this React application)
4. Create a `fly.toml` configuration file

## Step 5: Configure fly.toml

Your `fly.toml` file should look similar to this after initialization:

```toml
app = "your-digital-twin-app"
primary_region = "lax"

[build]
  dockerfile = "Dockerfile"

[http_service]
  internal_port = 80
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 1024
```

You can customize this file as needed. For a React application, the default settings should work well to start.

## Step 6: Deploy Your Application

```bash
fly deploy
```

This command builds your Docker image and deploys it to Fly.io.

## Step 7: Monitor Your Deployment

You can monitor your application's status with:

```bash
fly status
```

To view application logs:

```bash
fly logs
```

## Step 8: Access Your Application

After successful deployment, your application will be available at:

```
https://your-digital-twin-app.fly.dev
```

You can also open your application directly with:

```bash
fly open
```

## Step 9: Custom Domain Setup (Optional)

If you want to use a custom domain:

1. Add your domain to Fly.io:

```bash
fly domains add your-domain.com
```

2. Configure your DNS provider by adding a CNAME record pointing to your Fly.io application:

```
CNAME your-domain.com -> your-digital-twin-app.fly.dev
```

3. For root domains, you might need to use an A record with the IP address of your application:

```bash
fly ips list
```

Then create an A record with the IPv4 address.

## Step 10: Scaling Your Application (Optional)

To scale your application based on needs:

```bash
# Scale to multiple regions
fly regions add fra

# Scale to multiple instances
fly scale count 2
```

## Continuous Deployment

For continuous deployment with GitHub Actions, add a `.github/workflows/fly.yml` file:

```yaml
name: Fly Deploy
on:
  push:
    branches:
      - main
jobs:
  deploy:
    name: Deploy app
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

To set up the GitHub secret:

1. Generate a Fly.io API token:
```bash
fly auth token
```

2. Add this token as a secret named `FLY_API_TOKEN` in your GitHub repository settings.

## Troubleshooting

### Application Fails to Start

Check the logs for errors:

```bash
fly logs
```

### Application Builds Locally But Fails on Fly.io

Ensure your Dockerfile is correctly configured and all dependencies are defined in package.json.

### Performance Issues

Consider:
- Increasing the VM size in your `fly.toml` file
- Adding more VM instances with `fly scale count`
- Deploying to regions closer to your users

## Useful Fly.io Commands

```bash
# View application information
fly status

# SSH into your application
fly ssh console

# Restart application
fly apps restart

# Scale application
fly scale count <number> --app your-digital-twin-app

# Set secrets (environment variables)
fly secrets set MY_SECRET=value

# View metrics
fly metrics
```

## Additional Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [Fly.io Pricing](https://fly.io/docs/about/pricing/)
- [Fly.io Community Forum](https://community.fly.io/)

## Support

If you encounter issues with your Fly.io deployment, you can:

1. Check the [Fly.io Documentation](https://fly.io/docs/)
2. Ask questions on the [Fly.io Community Forum](https://community.fly.io/)
3. Contact Fly.io support through their website
