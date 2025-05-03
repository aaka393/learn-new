import { autoUpdater, dialog } from 'electron';
    import { version } from '../package.json';

    const server = 'https://your-update-server.com';
    const feed = `${server}/update/${process.platform}/${version}`;

    export function setupAutoUpdater() {
      autoUpdater.setFeedURL({ url: feed });

      // Check for updates every 5 minutes
      setInterval(() => {
        autoUpdater.checkForUpdates();
      }, 300000);

      autoUpdater.on('update-downloaded', (_event, releaseNotes, releaseName) => {
        const dialogOpts = {
          type: 'info' as const,
          buttons: ['Restart', 'Later'],
          title: 'Application Update',
          message: process.platform === 'darwin' ? releaseNotes : `A new version ${releaseName} has been downloaded. Restart the application to apply the updates.`,
          detail: `New version: ${releaseName}\n\n${releaseNotes || ''}`
        };

        dialog.showMessageBox(dialogOpts).then((returnValue) => {
          if (returnValue.response === 0) autoUpdater.quitAndInstall();
        });
      });

      autoUpdater.on('error', message => {
        console.error('There was a problem updating the application')
        console.error(message)
      });
    }
