const settingsButton = document.getElementById('settingsButton')
const settings = document.getElementById('settings')
const closeSettingsButton = document.getElementById('closeSettings')
const playPauseButton = document.getElementById('playPauseButton')
 
const audio = document.getElementById('audio')
 
settingsButton.addEventListener('click', () => {
    settings.style.display = 'block'
})
 
closeSettingsButton.addEventListener('click', () => {
    settings.style.display = 'none'
})
 
playPauseButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play()
        playPauseButton.innerText = '🔊'
    } else {
        audio.pause()
        playPauseButton.innerText = '🔈'
    }
})