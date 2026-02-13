# Script to install all required VS Code extensions
# Run this in PowerShell: .\install-extensions.ps1

Write-Host "Installing VS Code Extensions for React Native + Firebase..." -ForegroundColor Green

# Required Extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension msjsdiag.vscode-react-native-tools

# Recommended Extensions
code --install-extension jsayol.firebase-explorer
code --install-extension christian-kohler.path-intellisense
code --install-extension eamodio.gitlens
code --install-extension dsznajder.es7-react-js-snippets

Write-Host "`nAll extensions installed successfully! ✅" -ForegroundColor Green
Write-Host "Please restart VS Code/Cursor to activate extensions." -ForegroundColor Yellow
