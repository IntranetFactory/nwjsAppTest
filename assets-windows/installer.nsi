!include "MUI2.nsh"

Name "Now Assistant"
BrandingText "adenin.com"

# set the icon
!define MUI_ICON "icon.ico"

# define the resulting installer's name:
OutFile "..\dist\NowAssistantSetup.exe"

# set the installation directory
InstallDir "$PROGRAMFILES\Now Assistant\"

# app dialogs
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES

!define MUI_FINISHPAGE_RUN_TEXT "Start Now Assistant"
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
  WriteUninstaller "$INSTDIR\Uninstall Now Assistant.exe"

  # create shortcuts in the start menu and on the desktop
  CreateShortCut "$SMPROGRAMS\Now Assistant.lnk" "$INSTDIR\NowAssistant.exe"
  CreateShortCut "$SMPROGRAMS\Uninstall Now Assistant.lnk" "$INSTDIR\Uninstall Now Assistant.exe"
  CreateShortCut "$DESKTOP\Now Assistant.lnk" "$INSTDIR\NowAssistant.exe"

SectionEnd

# create a section to define what the uninstaller does
Section "Uninstall"

  # delete the installed files
  RMDir /r $INSTDIR

  # delete the shortcuts
  Delete "$SMPROGRAMS\Now Assistant.lnk"
  Delete "$SMPROGRAMS\Uninstall Now Assistant.lnk"
  Delete "$DESKTOP\Now Assistant.lnk"

SectionEnd
