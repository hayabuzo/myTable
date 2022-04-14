class Deleter {																								// класс корзины
	
	constructor(x,y,s) {																				// для создания требуются координаты и размер
		this.x = x;
		this.y = y;
		this.s = s;
		this.highlight = false;
	}
	
	check() {																										// функция проверки картинки на удаление
		if (this.highlight) {																			// если иконка корзины подсвечивается
			if(focus!='x' && !mouseIsPressed) { 										// если есть фокус на картинке и мышь отпущена
				p.splice(focus,1); 																		// то удаляем картинку в фокусе из массива
				for (let i = 0; i<p.length; i++) { p[i].l = i; }			// и пересчитываем номера слоев для всех картинок
			}
			this.highlight = false;																	// по умолчанию отключаем подсветку икноки
		}
	}
	
	show() {																										// отрисовка корзины

		push();
			let sb = this.s/7;
			let s = this.s*1.1;
			translate(this.x,this.y);
			noStroke(); fill(0);
			if(this.highlight) fill(255,0,0);
			rectMode(CENTER).rect(-sb*3,0,sb,s);
			rectMode(CENTER).rect(-sb*1,0,sb,s);
			rectMode(CENTER).rect(+sb*1,0,sb,s);
			rectMode(CENTER).rect(+sb*3,0,sb,s);
			rectMode(CENTER).rect(0,+s/2,sb*6,sb);
			rectMode(CENTER).rect(0,-s/2,sb*6,sb);
			push();
				translate(-s*0.1,-s*0.9);
				rotate(-PI/6);
				rectMode(CENTER).rect(0,0,sb*6,sb);
			pop();
		pop();
		
	}

}