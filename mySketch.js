let p = [];       																// глобальный массив картинок
let d;																						// глобальный объект-корзина

function preload() {
  imb = loadImage('pattern-3371709_1920.jpg');		// предзагружаем изображение для фона
}

function addfiles(file) {	   											// при открытии пользовательских файлов, для каждого файла:															

  if (file.type === 'image') 
		p.push(new Picture(loadImage(file.data),p.length,file.name,file.subtype));   	// если файл является изображением, то создаем из него объект-картинку
	file_input.value('');														// очищаем значение элемента для возможности повторной загрузки тех же файлов

  if (!loaded && p.length>0) { 										// если как минимум один файл загружен, то
		
		loaded = true;																// разрешаем выполнять draw() вместо начального экрана setup()
		
		file_input.position(10,10).size(168,30);			// передвигаем элементы с начального экрана и создаем новые
		
		sel.position(190,10).size(100,30).style('text-align: left');	
	
  	bg = createSelect();								bg.position(300,10).size(100,30);
		bg.style('font-family: monospace; font-size: 20px; text-align: left; background-color: black; color: white');
  	bg.option('wood');									bg.option('color');									bg.option('none');									bg.selected('wood');

		cp = createColorPicker('#808080');  cp.position(410,10).size(100,30);
		cp.style('font-family: monospace; font-size: 20px; text-align: left; background-color: black; color: white');
		
  	scr = createButton('Screenshot');		scr.position(520,10).size(150,30); 	scr.mousePressed(screenshot);
		scr.style('font-family: monospace; font-size: 20px; text-align: center; background-color: black; color: white');
		
  	srt = createButton('Sort');		      srt.position(680,10).size(80,30);  	srt.mousePressed(picsort);
		srt.style('font-family: monospace; font-size: 20px; text-align: center; background-color: black; color: white');
		
  	swp = createButton('Swap');		      swp.position(770,10).size(80,30);  	swp.mousePressed(picswap);
		swp.style('font-family: monospace; font-size: 20px; text-align: center; background-color: black; color: white');
		
  	clr = createButton('Clear');	      clr.position(860,10).size(80,30);  	clr.mousePressed(cleartable);
		clr.style('font-family: monospace; font-size: 20px; text-align: center; background-color: black; color: white');
		
		nms = createButton('Names'); 	    	nms.position(950,10).size(80,30);  	nms.mousePressed(shownames);		
		nms.style('font-family: monospace; font-size: 20px; text-align: center; background-color: black; color: white');
		
		windowResized();
		
	}

}

function shownames() {			// функция показа и скрытия имен
	names = !names;
}

function cleartable() {			// функция очистки стола
	let n = p.length;					// сохраняем полную длину массива
	p.splice(0,n); 						// используя эту несокращенную длинну, очищаем массив
}

function screenshot() {			// функция скриншота
	save(year()+nf(month(),2)+nf(day(),2)+"-"+nf(hour(),2)+nf(minute(),2)+nf(second(),2)+'.jpg');
}

function picsort() {																	// функция выстраивания картинок по сетке
	let aw = 5;																					// число картинок в строке
	let cell = floor(width/aw);													// расчет ширины ячеек
	let ah = floor(height/cell);												// число строк
	for (let i = 0; i < p.length; i++) {								// для каджой картинки в массиве
		p[i].loc.x = cell/2 + i%aw*cell;									// задаем новое расположение X
		p[i].loc.y = 50 + cell/2 + floor(i/aw)*cell; 			// задаем новое расположение Y
		p[i].f = 0;																				// задаем угол
		p[i].m = 0.3;																			// задаем масштаб
	}
}

function picswap() {																	// функция смахивания кратинок
	for (let i = 0; i < p.length; i++) {								// для каджой картинки в массиве
		p[i].loc.x = width;																// задаем новое расположение X
		p[i].loc.y = random(height);											// задаем новое расположение Y
		p[i].f = random(PI*2);														// задаем угол
	}
}

function startup() {																	// функция отображения графики начального экрана 
	
	background(100);
	
	let mx = width/2;	let my = 200;											// задаем временный центр переменными, т.к. элементы не принимают транслированные координаты
	
	stroke(255).noFill().textAlign(CENTER,CENTER).textSize(50).text('SLECET IMAGES',mx,my-70);
	rectMode(CENTER).stroke(255,100).noFill().rect(mx,my,500,300,30);
	
	push();
		translate(mx,600);
		strokeWeight(5).stroke(140).bezier( 0, -110, -30, -150, 30, -140, 0, -180);	strokeWeight(1);
		rectMode(CENTER).stroke(255,150).fill(120).rect(0,0,150,220,80);
		rectMode(CENTER).stroke(255,150).noFill().rect(0,-60,20,50,10);
		line(-74,-20,74,-20);
		line(0,-109,0,-86); 					line(0,-34,0,-21);
		stroke(255,50);
		line(-200,-150,-100,-150);    line(-99,-150,-35,-60);
		line(200,-150,100,-150);    	line(99,-150,35,-60);
		noStroke().fill(150).circle(-35,-60,5);
		noStroke().fill(150).circle(35,-60,5);
		noStroke().fill(150).textAlign(CENTER,CENTER).textSize(30).text('move',-150,-170);
		noStroke().fill(150).textAlign(CENTER,CENTER).textSize(30).text('resize',150,-170);
	pop();
	
  file_input = createFileInput(addfiles, true);	file_input.position(mx-200,my-10).size(400,'');
  file_input.style('font-family: monospace; font-size: 20px; background-color: black; text-align: center; color: white');

  sel = createSelect();  sel.position(mx-200,my+50).size(400,'');
	sel.style('font-family: monospace; font-size: 20px; text-align: center; background-color: black; color: white');
	sel.option('small');  sel.option('medium');  sel.option('large');  sel.selected('medium');

	
}

function setup() {
	
	for (let element of document.getElementsByClassName("p5Canvas")) { 
		element.addEventListener("contextmenu", (e) => e.preventDefault());  }  // блокировка стандартного поведения правой кнопки мыши
	
	createCanvas(windowWidth, windowHeight);			// создаем холст по размеру окна
	startup();																		// создаем графику начального экрана
	d = new Deleter(50,height-50,40);							// создаем объект-корзину
	loaded = false;																// по умолчанию запрещаем выполнение основного скетча до загрузки изображений
	names = false;																// по умолчанию не отображаем имена картинок
	focus = 'x';																	// по умолчанию все картинки вне фокуса
	
}

function draw() {
	
	if (loaded) {																										// если загружено хотя бы одно изображение
		
		d.check();																										// проверяем, не помещена ли картинка в корзину
		
		if      (bg.value()=='wood' ) image(imb,0,0,width,height);		// устанавливаем в качестве фона изображение
		else if (bg.value()=='color') background(cp.color());					// или однородный цвет
		
		for (let i = 0; i<p.length; i++) {		p[p.length-i-1].checkFocus();	}		// проверяем фокусировку от более новых (верхних) картинок к старым
		for (let i = 0; i<p.length; i++) {		p[i].show();            			}		// показываем картинки от более старых (нижних) к более новым

		d.show();																											// показываем икноку корзины
		
	}
	
}

function mouseWheel(event) {																	// при использовании колесика мыши
	if(focus!='x') {																						// если есть фокус на картинке
  	if(event.delta<0 && focus != p.length-1) {								// если колесико вращается вверх и картинка не самая верхняя
			let t = p[focus];																				// сохраняем картинку в фокусе
			p[focus] = p[focus+1];																	// заменяем текущую картинку верхней
			p[focus+1] = t;																					// заменяем верхнюю картинку сохраненной
			focus++;																								// переводим фокус на верхний слой
			for (let i = 0; i<p.length; i++) { p[i].l = i; }				// обновляем номера слоев для всего массива
		}	else if(event.delta>0 && focus != 0) { 									// если колесико вращается вниз и картинка не самая нижняя
			let t = p[focus];																				// сохраняем картинку в фокусе
			p[focus] = p[focus-1];																	// заменяем текущую картинку нижней
			p[focus-1] = t;																					// заменяем нижнюю картинку сохраненной
			focus--;																								// переводим фокус на нижний слой
			for (let i = 0; i<p.length; i++) { p[i].l = i; }				// обновляем номера слоев для всего массива
		}
	}
  return false;																								// запрещаем прокручивание окна колесиком
}

function windowResized() { 
	createCanvas(windowWidth, windowHeight);
	if (loaded) {
		cp .position(410%(width-100),10+40*floor(410/(width-100))).size(100,30);
		scr.position(520%(width-100),10+40*floor(520/(width-100))).size(150,30);
		srt.position(680%(width-100),10+40*floor(680/(width-100))).size(80,30);
		swp.position(770%(width-100),10+40*floor(770/(width-100))).size(80,30);
		clr.position(860%(width-100),10+40*floor(860/(width-100))).size(80,30);
		nms.position(950%(width-100),10+40*floor(950/(width-100))).size(80,30);
		d = new Deleter(50,height-50,40);
	} else {
		file_input.remove();
		sel.remove();
		startup();
	}
}
