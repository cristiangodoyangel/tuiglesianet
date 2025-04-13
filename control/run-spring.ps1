#!/usr/bin/env pwsh
#
# run-spring.ps1
# A PowerShell script to execute Maven wrapper commands and handle process termination properly
#

# Set error action preference
$ErrorActionPreference = "Stop"

try {
    Write-Host "Starting Spring Boot application..."
    
    # Create a temporary batch file that will run the Maven command and auto-respond to the prompt
    $tempBatchPath = [System.IO.Path]::GetTempFileName() + ".bat"
    @"
@echo off
cd $pwd
call ./mvnw clean spring-boot:run
echo S | choice /C SN /M "Terminating batch job"
exit %ERRORLEVEL%
"@ | Out-File -FilePath $tempBatchPath -Encoding ASCII
    
    # Run the batch file with proper process handling
    $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", $tempBatchPath -Wait -NoNewWindow -PassThru
    
    # Get the exit code
    $exitCode = $process.ExitCode
    
    # Clean up the temporary batch file
    if (Test-Path $tempBatchPath) {
        Remove-Item $tempBatchPath -Force
    }
    
    # Return the appropriate exit code
    if ($exitCode -eq 255) {
        # If exit code is 255 (from the batch termination prompt), consider it success
        exit 0
    } else {
        exit $exitCode
    }
} catch {
    Write-Error "Error executing Maven command: $_"
    exit 1
}

