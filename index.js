const {Panel}=require('sdk/panel')
const {ActionButton}=require('sdk/ui/button/action')
const {data}=require('sdk/self')
const tabs=require('sdk/tabs')
const {getFavicon}=require('sdk/places/favicon')
const {Hotkey}=require('sdk/hotkeys')
const {join, open}=require('sdk/io/file')
const simplePrefs=require('sdk/simple-prefs')
let backupFolder=simplePrefs.prefs
simplePrefs.on('backupFolder', ()=>backupFolder=simplePrefs.prefs.backupFolder)

let hotkey=Hotkey({
	combo: simplePrefs.prefs.hotkey,
	onPress: handleClick
})
simplePrefs.on('hotkey', ()=>{
	hotkey.destroy()
	hotkey=Hotkey({
		combo: simplePrefs.prefs.hotkey,
		onPress: handleClick
	})
})

const panel=Panel({
	contentURL: data.url('./panel.html'),
	contentScriptFile: data.url('./entry.js'),
	width: 700,
	height: 500
})

ActionButton({
	id: 'btnapp',
	label: 'BtnApp',
	icon: {
		'16': './icon/16.png',
		'32': './icon/32.png',
		'64': './icon/64.png'
	},
	onClick: handleClick
})

let bef=''
function handleClick() {
	panel.show()
	const arr=[...tabs].reverse().map(({id, title, url})=>
		getFavicon(url).catch(()=>"").then(favurl=>({id, title, url, favurl}))
	)
	Promise.all(arr).then(a=>{
		panel.port.emit('show', a)
		const str=a.map(v=>v.url).join('\n')
		if(bef!==str){
			const tr=open(join(backupFolder, new Date().toISOString().split('.')[0].replace(/[:-]/g, '').replace('T', '_')+'.txt'), 'w')
			if(!tr.closed) tr.writeAsync(str, ()=>{})
		}
	})
}
panel.port.on('activate', vid=>{
	[...tabs].filter(({id}) => id===vid)[0].activate()
	panel.hide()
})
panel.port.on('close', vid=>[...tabs].filter(({id}) => id===vid)[0].close())
