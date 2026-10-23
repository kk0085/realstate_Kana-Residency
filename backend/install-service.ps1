$ErrorActionPreference = 'Continue'

$log = 'C:\Users\kk bada\Documents\realstate\backend\install-service-result.log'
$nssm = 'C:\Users\kk bada\Documents\realstate\nssm\nssm.exe'
$node = 'C:\Program Files\nodejs\node.exe'
$main = 'C:\Users\kk bada\Documents\realstate\backend\server.js'
$dir = 'C:\Users\kk bada\Documents\realstate\backend'
$stdout = 'C:\Users\kk bada\Documents\realstate\backend\service.out.log'
$stderr = 'C:\Users\kk bada\Documents\realstate\backend\service.err.log'

function Log($msg) {
    Add-Content -Path $log -Value "[$(Get-Date -Format 'HH:mm:ss')] $msg"
}

Log '=== Install started ==='
Log "NSSM exists: $(Test-Path $nssm)"
Log "server.js exists: $(Test-Path $main)"

& $nssm stop RealEstateBackend 2>&1 | Out-Null
& $nssm remove RealEstateBackend confirm 2>&1 | Out-Null

& $nssm install RealEstateBackend $node $main 2>&1 | ForEach-Object { Log "install: $_" }
Log "install exit: $LASTEXITCODE"

& $nssm set RealEstateBackend AppDirectory $dir 2>&1 | ForEach-Object { Log "AppDirectory: $_" }
& $nssm set RealEstateBackend DisplayName 'Real Estate Backend API' 2>&1 | ForEach-Object { Log "DisplayName: $_" }
& $nssm set RealEstateBackend Description 'Real Estate website backend API server (Node.js/Express). Auto-starts with Windows.' 2>&1 | ForEach-Object { Log "Description: $_" }
& $nssm set RealEstateBackend Start SERVICE_AUTO_START 2>&1 | ForEach-Object { Log "Start: $_" }
& $nssm set RealEstateBackend AppExit Default Restart 2>&1 | ForEach-Object { Log "AppExit: $_" }
& $nssm set RealEstateBackend AppRestartDelay 3000 2>&1 | ForEach-Object { Log "AppRestartDelay: $_" }
& $nssm set RealEstateBackend AppStdout $stdout 2>&1 | ForEach-Object { Log "AppStdout: $_" }
& $nssm set RealEstateBackend AppStderr $stderr 2>&1 | ForEach-Object { Log "AppStderr: $_" }
& $nssm set RealEstateBackend AppRotateFiles 1 2>&1 | ForEach-Object { Log "AppRotateFiles: $_" }
& $nssm set RealEstateBackend AppRotateBytes 10485760 2>&1 | ForEach-Object { Log "AppRotateBytes: $_" }
& $nssm set RealEstateBackend AppNoConsole 1 2>&1 | ForEach-Object { Log "AppNoConsole: $_" }

Log 'Starting service...'
& $nssm start RealEstateBackend 2>&1 | ForEach-Object { Log "start: $_" }
Log "start exit: $LASTEXITCODE"

Start-Sleep -Seconds 5
$svc = Get-Service RealEstateBackend -ErrorAction SilentlyContinue
if ($svc) {
    Log "Service status: $($svc.Status) | StartType: $($svc.StartType)"
} else {
    Log 'Service not found!'
}

Log '=== Install finished ==='