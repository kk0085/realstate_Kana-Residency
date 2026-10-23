param(
    [ValidateSet("install", "start", "stop", "restart", "status", "remove")]
    [string]$Action = "status"
)

# Real Estate backend Windows service (NSSM) management script.
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\service.ps1 install    # admin required
#   powershell -ExecutionPolicy Bypass -File .\service.ps1 start
#   powershell -ExecutionPolicy Bypass -File .\service.ps1 stop
#   powershell -ExecutionPolicy Bypass -File .\service.ps1 restart
#   powershell -ExecutionPolicy Bypass -File .\service.ps1 status
#   powershell -ExecutionPolicy Bypass -File .\service.ps1 remove     # admin required

$ErrorActionPreference = "Continue"
$ServiceName = "RealEstateBackend"
$Nssm = "C:\Users\kk bada\Documents\realstate\nssm\nssm.exe"
$Node = (Get-Command node).Source

# Use 8.3 short paths (no spaces) because NSSM splits paths on spaces.
$fso = New-Object -ComObject Scripting.FileSystemObject
$NodeShort = $fso.GetFile($Node).ShortPath
$MainShort = $fso.GetFile("C:\Users\kk bada\Documents\realstate\backend\server.js").ShortPath
$DirShort = $fso.GetFolder("C:\Users\kk bada\Documents\realstate\backend").ShortPath

$Stdout = "C:\Users\kk bada\Documents\realstate\backend\service.out.log"
$Stderr = "C:\Users\kk bada\Documents\realstate\backend\service.err.log"

function Is-Admin {
    return ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent())
        .IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

switch ($Action) {
    "install" {
        if (-not (Is-Admin)) { throw "Admin rights required. Run this script as Administrator." }
        & $Nssm stop $ServiceName 2>&1 | Out-Null
        & $Nssm remove $ServiceName confirm 2>&1 | Out-Null
        & $Nssm install $ServiceName $NodeShort $MainShort 2>&1 | Write-Output
        & $Nssm set $ServiceName AppParameters $MainShort 2>&1 | Write-Output
        & $Nssm set $ServiceName AppDirectory $DirShort 2>&1 | Write-Output
        & $Nssm set $ServiceName DisplayName "Real Estate Backend API" 2>&1 | Write-Output
        & $Nssm set $ServiceName Description "Real Estate website backend API server (Node.js/Express). Auto-starts with Windows." 2>&1 | Write-Output
        & $Nssm set $ServiceName Start SERVICE_AUTO_START 2>&1 | Write-Output
        & $Nssm set $ServiceName AppExit Default Restart 2>&1 | Write-Output
        & $Nssm set $ServiceName AppRestartDelay 3000 2>&1 | Write-Output
        & $Nssm set $ServiceName AppStdout $Stdout 2>&1 | Write-Output
        & $Nssm set $ServiceName AppStderr $Stderr 2>&1 | Write-Output
        & $Nssm set $ServiceName AppRotateFiles 1 2>&1 | Write-Output
        & $Nssm set $ServiceName AppRotateBytes 10485760 2>&1 | Write-Output
        & $Nssm set $ServiceName AppNoConsole 1 2>&1 | Write-Output
        & $Nssm start $ServiceName 2>&1 | Write-Output
        Start-Sleep -Seconds 5
        Get-Service $ServiceName | Select-Object Name, Status, StartType | Format-Table -AutoSize
    }
    "start" {
        & $Nssm start $ServiceName 2>&1 | Write-Output
        Get-Service $ServiceName | Select-Object Name, Status | Format-Table -AutoSize
    }
    "stop" {
        & $Nssm stop $ServiceName 2>&1 | Write-Output
        Get-Service $ServiceName | Select-Object Name, Status | Format-Table -AutoSize
    }
    "restart" {
        & $Nssm restart $ServiceName 2>&1 | Write-Output
        Get-Service $ServiceName | Select-Object Name, Status | Format-Table -AutoSize
    }
    "remove" {
        if (-not (Is-Admin)) { throw "Admin rights required. Run this script as Administrator." }
        & $Nssm stop $ServiceName 2>&1 | Out-Null
        & $Nssm remove $ServiceName confirm 2>&1 | Write-Output
    }
    "status" {
        Get-Service $ServiceName | Select-Object Name, Status, StartType | Format-Table -AutoSize
        $listeners = netstat -ano | Select-String "LISTENING" | Select-String ":5000"
        if ($listeners) { Write-Output "Port 5000: LISTENING" } else { Write-Output "Port 5000: not listening" }
    }
}