# TransitOps Fleet Command Center - Site Builder
# Reads all stitch HTML files, injects nav links, and copies to public/screens/

$stitch = "d:\FleetOps\stitch\stitch_transitops_fleet_command_center"
$output = "d:\FleetOps\public\screens"

# Screen definitions - folder name to display label
$screens = @(
    @{ folder="transitops_fleet_command_center_dashboard"; file="dashboard.html"; label="Dashboard"; icon="dashboard"; active=$false }
    @{ folder="transitops_fleet_management_vehicle_registry"; file="fleet.html"; label="Fleet"; icon="directions_car"; active=$false }
    @{ folder="transitops_driver_management_workforce_operations"; file="drivers.html"; label="Drivers"; icon="person"; active=$false }
    @{ folder="transitops_trip_operations_command_center_1"; file="trips1.html"; label="Trips (Live)"; icon="route"; active=$false }
    @{ folder="transitops_trip_operations_command_center_2"; file="trips2.html"; label="Trips (Planning)"; icon="map"; active=$false }
    @{ folder="transitops_safety_compliance_command_center"; file="safety.html"; label="Safety"; icon="security"; active=$false }
    @{ folder="transitops_finance_center_executive_intelligence_inr"; file="finance.html"; label="Finance"; icon="payments"; active=$false }
    @{ folder="transitops_ai_intelligence_center_predictive_command_hub"; file="ai.html"; label="AI Intelligence"; icon="psychology"; active=$false }
    @{ folder="transitops_administration_center_platform_governance_hub"; file="admin.html"; label="Administration"; icon="settings"; active=$false }
    @{ folder="fleet_intelligence"; file="fleet-intel.html"; label="Fleet Intelligence"; icon="hub"; active=$false }  # no code.html
)

# Nav injection script/style
$navStyle = @"
<style id="nav-overlay-style">
#nav-overlay-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  background: rgba(19,27,46,0.97);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 16px;
  z-index: 99999;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  overflow-x: auto;
  font-family: 'Inter', sans-serif;
}
#nav-overlay-bar::-webkit-scrollbar { height: 0; }
.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  text-decoration: none;
  margin-right: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
}
.nav-brand span { font-size: 18px; }
.nav-link {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 8px;
  color: rgba(255,255,255,0.65);
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.15s ease;
  cursor: pointer;
  border: none;
  background: none;
}
.nav-link:hover { background: rgba(255,255,255,0.1); color: #fff; }
.nav-link.active { background: rgba(255,255,255,0.15); color: #fff; font-weight: 600; }
.nav-link.disabled { opacity: 0.35; cursor: not-allowed; }
.nav-link .mat-icon { font-family: 'Material Symbols Outlined'; font-size: 16px; font-style: normal; font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 20; }
.nav-sep { width: 1px; height: 20px; background: rgba(255,255,255,0.1); margin: 0 4px; flex-shrink: 0; }
.nav-logout {
  margin-left: auto;
  padding: 5px 10px;
  border-radius: 8px;
  color: rgba(255,255,255,0.55);
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.15s ease;
  cursor: pointer;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  gap: 5px;
}
.nav-logout:hover { background: rgba(186,26,26,0.25); color: #ff8a80; }
body { padding-top: 52px !important; }
</style>
"@

$navLinks = @()
foreach ($s in $screens) {
    if ($s.folder -eq "fleet_intelligence") {
        $navLinks += "<a class='nav-link disabled' title='Not yet added'><span class='mat-icon'>$($s.icon)</span>$($s.label)</a>"
    } else {
        $navLinks += "<a class='nav-link' href='$($s.file)'><span class='mat-icon'>$($s.icon)</span>$($s.label)</a>"
    }
    if ($s.label -eq "Trips (Planning)" -or $s.label -eq "Finance") {
        $navLinks += "<div class='nav-sep'></div>"
    }
}

$navHtml = @"
<div id="nav-overlay-bar">
  <a class="nav-brand" href="../index.html">
    <span class="mat-icon">local_shipping</span>TransitOps
  </a>
  <div class="nav-sep"></div>
  $($navLinks -join "`n  ")
  <a class="nav-logout" href="../index.html"><span class="mat-icon">logout</span>Logout</a>
</div>
<script>
(function(){
  // Mark active link based on current filename
  var cur = window.location.pathname.split('/').pop();
  document.querySelectorAll('#nav-overlay-bar .nav-link').forEach(function(a){
    if(a.getAttribute('href') === cur) a.classList.add('active');
  });
})();
</script>
"@

$navInjection = $navStyle + "`n" + "<body-inject>" 
# We will replace </head> with navStyle + </head>, and <body> with <body><navHtml>

foreach ($s in $screens) {
    if ($s.folder -eq "fleet_intelligence") { continue }  # no code.html, skip

    $srcFile = Join-Path $stitch "$($s.folder)\code.html"
    $dstFile = Join-Path $output $s.file

    if (-not (Test-Path $srcFile)) {
        Write-Host "SKIP (no code.html): $($s.folder)"
        continue
    }

    $content = Get-Content $srcFile -Raw -Encoding UTF8

    # 1. Inject nav style before </head>
    $content = $content -replace '</head>', ($navStyle + "</head>")

    # 2. Inject nav bar HTML right after <body (handling <body ...> variations)
    $content = $content -replace '(<body[^>]*>)', ('$1' + "`n" + $navHtml)

    # 3. Fix any existing sidebar nav href="#" links - replace with proper screen links
    # Dashboard sidebar
    $content = $content -replace "(<a [^>]*>)\s*(<span[^>]*>\s*dashboard\s*</span>)\s*(<span[^>]*>Dashboard</span>)", '<a class="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors transition-all duration-200" href="dashboard.html">$2 $3'
    $content = $content -replace 'href="#"([^>]*>)\s*(<span[^>]*material-symbols[^>]*>\s*directions_car\s*</span>)', 'href="fleet.html"$1 $2'
    $content = $content -replace 'href="#"([^>]*>)\s*(<span[^>]*material-symbols[^>]*>\s*person\s*</span>)', 'href="drivers.html"$1 $2'
    $content = $content -replace 'href="#"([^>]*>)\s*(<span[^>]*material-symbols[^>]*>\s*route\s*</span>)', 'href="trips1.html"$1 $2'
    $content = $content -replace 'href="#"([^>]*>)\s*(<span[^>]*material-symbols[^>]*>\s*security\s*</span>)', 'href="safety.html"$1 $2'
    $content = $content -replace 'href="#"([^>]*>)\s*(<span[^>]*material-symbols[^>]*>\s*payments\s*</span>)', 'href="finance.html"$1 $2'
    $content = $content -replace 'href="#"([^>]*>)\s*(<span[^>]*material-symbols[^>]*>\s*psychology\s*</span>)', 'href="ai.html"$1 $2'
    $content = $content -replace 'href="#"([^>]*>)\s*(<span[^>]*material-symbols[^>]*>\s*settings\s*</span>)', 'href="admin.html"$1 $2'

    [System.IO.File]::WriteAllText($dstFile, $content, [System.Text.Encoding]::UTF8)
    Write-Host "OK: $($s.file)"
}

# Create placeholder for fleet_intelligence
$placeholder = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>TransitOps | Fleet Intelligence</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
$navStyle
</head>
<body class="bg-slate-50 min-h-screen flex flex-col" style="font-family:'Inter',sans-serif;">
$navHtml
<div class="flex-1 flex items-center justify-center">
  <div class="text-center max-w-md p-12">
    <div class="w-20 h-20 rounded-2xl bg-slate-200 flex items-center justify-center mx-auto mb-6">
      <span style="font-family:'Material Symbols Outlined';font-size:40px;color:#64748b;font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 48;">hub</span>
    </div>
    <h2 style="font-size:24px;font-weight:700;color:#1e293b;margin-bottom:12px;">Fleet Intelligence</h2>
    <p style="font-size:15px;color:#64748b;line-height:1.6;">This screen has not been added yet. The design is currently in progress and will be available in a future update.</p>
    <a href="dashboard.html" style="display:inline-flex;align-items:center;gap:8px;margin-top:24px;padding:10px 20px;background:#0f172a;color:#fff;border-radius:10px;font-size:13px;font-weight:600;text-decoration:none;">
      <span style="font-family:'Material Symbols Outlined';font-size:16px;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 20;">arrow_back</span>
      Back to Dashboard
    </a>
  </div>
</div>
</body>
</html>
"@

[System.IO.File]::WriteAllText((Join-Path $output "fleet-intel.html"), $placeholder, [System.Text.Encoding]::UTF8)
Write-Host "OK: fleet-intel.html (placeholder)"

Write-Host "`nBuild complete! All files written to: $output"
