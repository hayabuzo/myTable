class Picture {																										// класс храниит данные для каждой картинки
	
	constructor(img,layer,name,type) {															// для создания требуется изображение, номер слоя, имя изображения, тип файла
		this.img = img;  	this.l = layer;															// получаем локальные переменные из конструктора
		this.name = name; this.type = type;														
		this.w = 1;   	 	this.h = 1;																	// устанавливаем минимальную длину и ширину, пока картинка не подгрузилась
		this.m = 0.6;		 																						  // устанавливаем масштаб по умолчанию (medium)
		this.f = random(PI*2);																				// новая картинка создается под случайным углом
		this.loc = createVector(random(width),random(height)); 				// в случайном месте
		this.vel = createVector(0,0); this.fv = 0; this.take = false;	// инициализируем скорость, угловую скорость, захват
	}
	
	checkFocus() {																									// функция проверки на фокус
		if(mouseIsPressed && this.take && focus=='x') 								// если изображение захвачено мышью и в фокусе нет верхних картинок
			focus = this.l;																							// устанавливаем фокус на слой текущей картинки
	}
	
	show() {																																			// функция показа картинки
		
		if (this.w==1 && this.h==1 && this.img.width>1 && this.img.height>1) {			// если кратинка уже подгружена, но еще не отображается
			let k = min(width,height)*0.9/max(this.img.width,this.img.height);				// рассчитываем коэффициент опитмального отображения картики по экрану
			this.w = k*this.img.width;	 this.h = k*this.img.height;									// подгоняем картинку под коэффициент
			if(sel.value()=='small')this.m=0.3; if(sel.value()=='large')this.m=0.9; 	// меняем масштаб картинки по настройкам импорта
			
		}
		
		push();																																																																					// рисуем картинку в локальных координатах
			translate(this.loc.x,this.loc.y).rotate(this.f);																																															// сдвигаем и поворачиваем локальный холст
			if(this.type!='png') rectMode(CENTER).noStroke().fill(0,200).rect(2*this.m*sin(this.f),2*this.m*cos(this.f),this.w*this.m,this.h*this.m);			// рисуем тень
			imageMode(CENTER); image(this.img,0,0,this.w*this.m,this.h*this.m); 																																					// рисуем картинку
			if (names) noStroke().fill(brightness(cp.color())>50?0:255).textAlign(CENTER, TOP).textSize(20*this.m).text(this.name,0,this.h*this.m*0.51);	// рисуем имя картинки
		pop();																																																																					// выходим из локлаьных координат
		
		if(mouseIsPressed) {																																									// если нажата кнопка мыши
			
			if(!this.hold) {	this.hold = true;																																	// фиксируем в первый момент нажатия:
				this.tch = createVector(mouseX,mouseY);																														// координаты нажатия
				this.tch.m = this.tch.copy().sub(this.loc).mag();																									// расстояние от точки нажатия до центра картинки
				this.tch.a = this.tch.copy().sub(this.loc).heading()-this.f;																			// угол нажатия относительно центра и угла картинки
				this.m_pr = this.m;																																								// масштаб картинки
								 
				let mag = sqrt((this.w*this.m*0.5)**2+(this.h*0.5*this.m)**2);																		// определяем длину диагонали картинки
				let ang = atan(this.h/this.w);																																		// и ее угол наклона
				
				let p1 = createVector(this.loc.x+mag*cos(this.f+ang   ), this.loc.y+mag*sin(this.f+ang   ));			// находим положение углов картинки
				let p2 = createVector(this.loc.x+mag*cos(this.f-ang+PI), this.loc.y+mag*sin(this.f-ang+PI));			
				let p3 = createVector(this.loc.x+mag*cos(this.f+ang+PI), this.loc.y+mag*sin(this.f+ang+PI));			
				let p4 = createVector(this.loc.x+mag*cos(this.f-ang   ), this.loc.y+mag*sin(this.f-ang   ));			
				
				p2.sub(p1); p1.x = mouseX-p1.x; p1.y = mouseY-p1.y;																								// направляем векторы из двух противоположных углов к указателю мыши
				p4.sub(p3); p3.x = mouseX-p3.x; p3.y = mouseY-p3.y; 
											
				if ( p2.angleBetween(p1) < PI/2 && p2.angleBetween(p1) > 0 && p4.angleBetween(p3) < PI/2	&& p4.angleBetween(p3) > 0 )  // если указатель мыши попал на картинку
					this.take = true;																																																			// то активируем взятие
								 
			}
			
			if (this.take && focus == this.l) {																																	// если взятие активно и фокус на слое картинки
				
				if (mouseButton == LEFT) {																																				// если картинка взята левой кнопкой мыши
					if (this.tch.m>min(this.w*this.m,this.h*this.m)*0.4) { 																					// если точка взятия находится вне радиуса перетаскивания
						this.tch.add(createVector(mouseX,mouseY).sub(this.tch));																			// сдвигаем точку взятия вместе с картинкой
						this.f-=(this.tch.a-(this.tch.copy().sub(this.loc).heading()-this.f));												// поворачиваем картинку вслед за точкой взятия
						let bone = this.tch.copy().sub(this.loc);																											// создаем балку между центром картинки и точкой взятия
						this.loc.add(bone.copy().normalize().mult( (bone.mag()-this.tch.m)) );												// сдвигаем картинку вслед за точкой взятия
						let v0 = createVector(pmouseX,pmouseY).sub(this.loc);																					// создаем временные векторы для расчета угловой скорости
						let v1 = createVector(mouseX,mouseY).sub(this.loc);
						this.fv = v0.angleBetween(v1);																																// определяем угловую скорость после перетаскивания
					} else this.loc = createVector(mouseX-this.tch.m*cos(this.tch.a+this.f),mouseY-this.tch.m*sin(this.tch.a+this.f));		// иначе перетаскиваем картинку напрямую без поворота
					this.vel = createVector(mouseX-pmouseX,mouseY-pmouseY);																					// всякое перетаскивание сообщает картинке скорость
					if(createVector(mouseX-d.x,mouseY-d.y).mag()<d.s) d.highlight = true;														// если картинка поднесена к корзине, корзина подсвечивается
				}
				
				if (mouseButton == RIGHT) {																																				// если картинка взята правой кнопкой мыши
					this.loc.add(createVector(mouseX-pmouseX,mouseY-pmouseY).mult(0.5));														// сдвигаем картинку в сторону перетаскивания
					this.tch.add(createVector(mouseX,mouseY).sub(this.tch));																				// сдвигаем точку взятия вместе с картинкой
					this.f-=(this.tch.a-(this.tch.copy().sub(this.loc).heading()-this.f));													// поворачиваем картинку
					let v1 = createVector(mouseX,mouseY).sub(this.loc);																							// создаем временную переменную для расчета масштаба
					this.m = constrain(v1.mag()/this.tch.m*this.m_pr,-1.5,1.5);																			// меняем масштаб картинки, в пределах от -1.5 до 1.5
				}
				
				if (mouseButton == CENTER) {																																			// если картинка взята центральной кнопкой мыши
					if(this.m > 0.3) this.m = 0.2;																																	// если масштаб картинки большой, то сворачиваем картинку
					else this.m = 1.0;																																							// иначе разворачиваем картинку до полного масштаба
					mouseIsPressed = false;																																					// блокируем повторное выполнение действия
				}
				
			}
	
		} else {																									// если кнопка мыши не нажата
			this.hold = false; 	 this.take = false;									// деактивируем взятие и удержание
			this.vel.mult(0.8);	 this.loc.add(this.vel);						// уменьшаем линейную скорость и прбавляем ее к координатам
			this.fv *= 0.8;      this.f += this.fv;									// уменьшаем угловую сокрость и прибавляем ее к углу
			focus = 'x';																						// убираем фокус
		}
		
		this.loc.x = constrain(this.loc.x,0,width);								// ограничиваем координаты картинки
		this.loc.y = constrain(this.loc.y,0,height);
			
	}
	
}