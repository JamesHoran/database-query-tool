# PM2 Commands

## Start

```bash
pnpm run pm2:dev    # Start dev server
pnpm run pm2:prod   # Start prod server
```

## Manage

```bash
pm2 list            # Show all processes
pm2 logs            # View logs
pm2 logs <name|id>  # View logs for specific app
pm2 logs --lines 50 # Show last 50 lines

pm2 stop <name|id>  # Stop a process
pm2 stop all        # Stop all processes

pm2 restart <name|id>  # Restart a process
pm2 restart all        # Restart all processes

pm2 delete <name|id>  # Stop and delete a process
pm2 delete all        # Stop and delete all processes
```

## Examples

```bash
pm2 stop dev         # Stop dev by name
pm2 stop 2           # Stop process with ID 2
pm2 restart prod     # Restart prod by name
pm2 delete all       # Delete everything
```

## Persistence

```bash
pm2 save    # Save current process list
pm2 startup # Generate startup script for auto-restart on boot
```
