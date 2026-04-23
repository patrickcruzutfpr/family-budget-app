<#
.SYNOPSIS
  Run simple integration checks against the local AI proxy at http://localhost:3001

.DESCRIPTION
  Starts the Node AI proxy (via `npx tsx server/index.ts`) in the background,
  waits for the health endpoint, then sends a few sample POST requests to
  `/api/ai/suggestions` using PowerShell's `Invoke-RestMethod`. Finally stops
  the background server process.

#>

param(
  [int]$Port = 3001,
  [int]$StartTimeoutSec = 15
)

Write-Output "Starting AI proxy (server/index.ts)..."
$proc = Start-Process -FilePath "npx" -ArgumentList "tsx","server/index.ts" -NoNewWindow -PassThru

try {
  $started = $false
  $deadline = (Get-Date).AddSeconds($StartTimeoutSec)
  while ((Get-Date) -lt $deadline) {
    try {
      $h = Invoke-RestMethod -Uri "http://localhost:$Port/api/health" -Method Get -TimeoutSec 2
      if ($h -and $h.status -eq 'ok') { $started = $true; break }
    } catch { Start-Sleep -Milliseconds 500 }
  }

  if (-not $started) {
    throw "AI proxy did not start within $StartTimeoutSec seconds. Check server logs."
  }

  Write-Output "AI proxy is running. Sending test requests..."

  $payload = @{ language = 'en'; budgetSummary = @{ totalIncome = 3000; expenses = @( @{ category = 'Rent'; projected = 1200; actual = 1200 } , @{ category = 'Groceries'; projected = 400; actual = 600 } ) } } | ConvertTo-Json -Depth 6

  try {
    $resp = Invoke-RestMethod -Uri "http://localhost:$Port/api/ai/suggestions" -Method Post -Body $payload -ContentType 'application/json' -TimeoutSec 120
    Write-Output "Response (parsed):"
    $resp | ConvertTo-Json -Depth 5 | Write-Output
  } catch {
    Write-Output "Request failed:"
    Write-Output $_.Exception.Message
    if ($_.Exception.Response) {
      try { $_.Exception.Response.GetResponseStream() | Get-Content -Raw | Write-Output } catch { }
    }
    throw
  }

} finally {
  if ($proc -and -not $proc.HasExited) {
    Write-Output "Stopping AI proxy (PID $($proc.Id))..."
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
  }
}

Write-Output "Done."
