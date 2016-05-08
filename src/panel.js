const {elementVoid, elementOpen, elementClose, text, patch}=require('incremental-dom')
const {filter}=require('fuzzy')
const debounce=require('lodash.debounce')

const tabul=document.getElementById('tabs')
const searchbar=document.getElementById('searchbar')
let l=null
let before=-1
let selected=-1

function format(str, cls){
	const a=str.replace(/([^\n]*)\n([^\n]*)\n/g, (_, p1, p2)=>{
		if(p1!=='') text(p1)
		if(p2!=='') {
			elementOpen('b')
				text(p2)
			elementClose('b')
		}
		return ''
	})
	if(a!=='') text(a)
}
let ignoreIds=[]
let cachedIds=""
function render(arr){
	return function(){
		tabul.scrollTop=0
		const ids=[]
		elementOpen('ul')
		arr.forEach(({id, title, url, favurl}, i)=>{
			ids.push(id)
			if(!!~ignore.indexOf(id)) return;
			elementOpen('li', id, ['id', 'tabs-item'+id, 'class', 'tabs-item'], 'onclick', e=>{
				e.stopPropagation()
				self.port.emit('activate', id)
			})
				elementOpen('img', null, ['class', 'favicon'], 'src', favurl || '1px_transparent.png')
				elementClose('img')
				elementOpen('div', null, ['class', 'details'])
					elementOpen('div', null, ['class', 'title'])
						format(title)
					elementClose('div')
					elementOpen('div', null, ['class', 'url'])
						format(url)
					elementClose('div')
				elementClose('div')
				elementOpen('button', null, ['class', 'close'], 'onclick', e=>{
					document.getElementById('tabs-item'+id).style.display='none'
					ignoreIds.push(id)
					self.port.emit('close', id)
					e.stopPropagation()
					searchbar.focus()
				})
					text('×')
				elementClose('button')
			elementClose('li')
		})
		const idsj=ids.join(' ')
		if(cachedIds!==idsj){
			selected=-1
			before=-1
			cachedIds=idsj
			Array.from(tabul.querySelectorAll(':scope>ul>li')).forEach(v=>v.setAttribute('data-selected', ''))
		}
		return elementClose('ul')
	}
}

function listener(arr){
	let cachedValue=''
	return function(){
		const text=this.value
		if(cachedValue===text) return;
		cachedValue=text

		const set=new Set()
		const titles=filter(text, arr, {pre: '\n', post: '\n', extract: e=>e.title})
		titles.forEach(({index}) => set.add(index))
		const urls=filter(text, arr, {pre: '\n', post: '\n', extract: e=>e.url}).filter(({index}) => !set.has(index))
		patch(tabul, render([].concat(
			titles.map(({index, string}) => {
				const {id, url, favurl}=arr[index]
				return {id, title: string, url, favurl}
			}),
			urls.map(({index, string}) => {
				const {id, title, favurl}=arr[index]
				return {id, url: string, title, favurl}
			})
		)))
	}
}

function downlisten({key}){
	const el=tabul.querySelectorAll(':scope>ul>li')

	if(key==='Enter') self.port.emit('activate', el[selected===-1?0:selected].id.replace(/^tabs-item/, ''))
	else if(key==='ArrowDown' && ++selected>=el.length) selected=el.length-1
	else if(key==='ArrowUp' && --selected<0) selected=0
	if(before!==selected){
		if(el[before]!=null) el[before].setAttribute('data-selected', '')
		if(el[selected]!=null) el[selected].setAttribute('data-selected', 'selected')
	}
	console.log(selected, before)
	before=selected
}

self.port.on('show', function(arr){
	ignore=[]
	if(l!==null){
		searchbar.removeEventListener('keyup', l, false)
		searchbar.removeEventListener('keydown', downlisten, false)
	}
	searchbar.value=''
	const el=tabul.querySelectorAll(':scope>ul>li')
	if(el[before]!=null) el[before].setAttribute('data-selected', '')
	before=-1
	selected=-1

	patch(tabul, render(arr))
	searchbar.addEventListener('keyup', l=debounce(listener(arr), 100), false)
	searchbar.addEventListener("keydown", downlisten, false)
	searchbar.focus()
})
