!include "MUI2.nsh"

Name "NowAssistant"
BrandingText "aluxian.com"

# set the icon
!define MUI_ICON "icon.ico"

# define the resulting installer's name:
OutFile "..\dist\NowAssistantSetup.exe"

# set the installation directory
InstallDir "$PROGRAMFILES\NowAssistant for Desktop\"

# app dialogs
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES

!define MUI_FINISHPAGE_RUN_TEXT "Start NowAssistant"
!define MUI_FINISHPAGE_RUN $INSTDIR\NowAssistant.exe

!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

# default section start
Section

  # delete the installed files
  RMDir /r $INSTDIR

  # define the path to which the installer should install
  SetOutPath $INSTDIR

  # specify the files to go in the output path
  File /r ..\build\NowAssistant\win32\*

  # create the uninstaller
  WriteUninstaller "$INSTDIR\Uninstall NowAssistant for Desktop.exe"

  # create shortcuts in the start menu and on the desktop
  CreateShortCut "$SMPROGRAMS\NowAssistant.lnk" "$INSTDIR\NowAssistant.exe"
  CreateShortCut "$SMPROGRAMS\Uninstall NowAssistant for Desktop.lnk" "$INSTDIR\Uninstall NowAssistant for Desktop.exe"
  CreateShortCut "$DESKTOP\NowAssistant.lnk" "$INSTDIR\NowAssistant.exe"

SectionEnd

# create a section to define what the uninstaller does
Section "Uninstall"

  # delete the installed files
  RMDir /r $INSTDIR

  # delete the shortcuts
  Delete "$SMPROGRAMS\NowAssistant.lnk"
  Delete "$SMPROGRAMS\Uninstall NowAssistant for Desktop.lnk"
  Delete "$DESKTOP\NowAssistant.lnk"

SectionEnd
