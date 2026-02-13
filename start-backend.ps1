# Cargar variables desde .env.local (ignorado por git)
$envFile = Join-Path $PSScriptRoot ".env.local"
if (Test-Path $envFile) {
	Get-Content $envFile | ForEach-Object {
		$line = $_.Trim()
		if ($line -and -not $line.StartsWith("#")) {
			$parts = $line.Split("=", 2)
			if ($parts.Length -eq 2) {
				$name = $parts[0].Trim()
				$value = $parts[1].Trim()
				if ($name) {
					Set-Item -Path ("Env:{0}" -f $name) -Value $value
				}
			}
		}
	}
}

# Validar variables requeridas
$requiredVars = @(
	"SMTP_USERNAME",
	"SMTP_PASSWORD",
	"SMTP_FROM",
	"ADMIN_EMAIL",
	"ADMIN_PASSWORD",
	"JWT_SECRET"
)
$missing = $requiredVars | Where-Object {
	[string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($_))
}
if ($missing.Count -gt 0) {
	Write-Host "Faltan variables de entorno en .env.local: $($missing -join ', ')" -ForegroundColor Red
	Write-Host "Crea .env.local con las variables requeridas antes de iniciar." -ForegroundColor Yellow
	Exit 1
}

# Refresh PATH for this session
$env:Path = [Environment]::GetEnvironmentVariable('Path','User') + ';' + [Environment]::GetEnvironmentVariable('Path','Machine')

# Set JAVA_HOME if missing
if (-not $env:JAVA_HOME) {
	$javaHome = (Get-ChildItem 'HKLM:\SOFTWARE\JavaSoft\JDK' -ErrorAction SilentlyContinue | Get-ItemProperty | Select-Object -ExpandProperty JavaHome -First 1)
	if ($javaHome) {
		$env:JAVA_HOME = $javaHome
		$env:Path = "$env:JAVA_HOME\bin;$env:Path"
	}
}

Set-Location -Path "$PSScriptRoot\backend"

mvn spring-boot:run
