try {
    Copy-Item "C:\Users\mcnas\.gemini\antigravity\brain\8f67adee-f392-4e0e-8adf-5f2c7df76eb0\hero_bg_1766321048683.png" "d:\My Web Projects\XclusvxmotionPictures\frontend\src\assets\hero_bg.jpg" -Force -ErrorAction Stop
    Write-Host "Success"
} catch {
    Write-Host "Error: $_"
    exit 1
}
