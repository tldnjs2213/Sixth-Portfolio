(() => {
	const addComma = (numArg) => {
		return (numArg = numArg
			.toString()
			.split('')
			.reverse()
			.map((value, index) => {
				index % 3 == 0 && index != 0 && (value += ',');
				return value;
			})
			.reverse()
			.join(''));
	};
	const subComma = (strArg) => {
		return strArg.replace(/\,/g, '');
	};

	class TopContainer {
		static arrDoughnutInfo = [];
		static quantityCount = 1;
		static arrProductInfo = [];
		constructor() {
			this.objProductInfo = {};
			this.bottomContainer = new BottomContainer();
		}
		createProductItem() {
			document.querySelectorAll('.liProductContainer').forEach((value) => {
				value.addEventListener('click', ({ currentTarget }) => {
					console.log(TopContainer.arrProductInfo);
					let boolHandler = true;
					let searchIndex = 0;
					TopContainer.arrProductInfo.forEach((value, index) => {
						if (value['id'] == currentTarget.querySelector('input[type="hidden"]').value) {
							value['quantity']++;
							value['price'] = (value['price'] / (value['quantity'] - 1)) * value['quantity'];
							boolHandler = false;
							searchIndex = index;
							document.querySelectorAll('.spanOrderListQuantity')[searchIndex].innerHTML = value['quantity'];
							document.querySelectorAll('.spanOrderListPrice')[searchIndex].innerHTML = addComma(value['price'].toString());
							this.bottomContainer.printAllCount();
							this.bottomContainer.printAmount();
						}
					});
					if (boolHandler) {
						document.querySelector('.ulOrderListContainer').innerHTML += `
						<li class="liOrderListContainer">
							<input type="hidden" name = "productIndex" value="${currentTarget.querySelector('input[type="hidden"]').value}">
							<span class="spanOrderListTitle">${currentTarget.querySelector('.h2ProductTitle').textContent}</span>
							<div class="divOrderListQuantityContainer">
								<i class="xi-minus-min iMinusIcon"></i>
								<span class="spanOrderListQuantity">${TopContainer.quantityCount}</span>
								<i class="xi-plus-min iPlusIcon"></i></div>
							<span class="spanOrderListPrice">${currentTarget.querySelector('.spanPrice').textContent}</span>
							<i class="xi-close-min iCloseIcon"></i>
						</li>
				`;
						this.objProductInfo = {
							id: parseInt(`${currentTarget.querySelector('input[type="hidden"]').value}`),
							productName: `${currentTarget.querySelector('.h2ProductTitle').textContent}`,
							price: parseInt(subComma(`${currentTarget.querySelector('.spanPrice').textContent}`)),
							quantity: 1,
						};
						console.log(this.objProductInfo);
						TopContainer.arrProductInfo.push(this.objProductInfo); // {}
						console.log(TopContainer.arrProductInfo);
						this.clickPlusMinusQuantity();
						this.deleteProductItem(TopContainer.arrProductInfo);
					}
					this.bottomContainer.printAllCount();
					this.bottomContainer.printAmount();
				});
			});
			this.bottomContainer.inputMoneyPayment();
			this.bottomContainer.allReset();
		}
		clickPlusMinusQuantity() {
			document.querySelectorAll('.iMinusIcon').forEach((value) => {
				value.addEventListener('click', (event) => {
					TopContainer.arrProductInfo = TopContainer.arrProductInfo.map((value02) => {
						if (value02['id'] == event.target.parentElement.parentElement.querySelector('input[type="hidden"]').value) {
							if (value02['quantity'] > 1) {
								--value02['quantity'];
								let numValuePrice = value02['price'] / (value02['quantity'] + 1);
								value02['price'] = numValuePrice * value02['quantity'];
								let spanOrderListPrice = event.target.parentElement.parentElement.querySelector('.spanOrderListPrice');
								spanOrderListPrice.innerHTML = addComma(value02['price'].toString());
							}
						}
						this.bottomContainer.printAllCount();
						this.bottomContainer.printAmount();
						return value02;
					});
					let spanOrderListQuantity = event.target.parentElement.parentElement.querySelector('.spanOrderListQuantity');
					if (spanOrderListQuantity.innerHTML != 1) {
						--spanOrderListQuantity.innerHTML;
						this.bottomContainer.printAllCount();
						this.bottomContainer.printAmount();
					}
					console.log(TopContainer.arrProductInfo);
				});
			});
			document.querySelectorAll('.iPlusIcon').forEach((value) => {
				value.addEventListener('click', (event) => {
					TopContainer.arrProductInfo = TopContainer.arrProductInfo.map((value02) => {
						if (value02['id'] == event.target.parentElement.parentElement.querySelector('input[type="hidden"]').value) {
							++value02['quantity'];
							let numValuePrice = value02['price'] / (value02['quantity'] - 1);
							value02['price'] = numValuePrice * value02['quantity'];
							let spanOrderListPrice = event.target.parentElement.parentElement.querySelector('.spanOrderListPrice');
							spanOrderListPrice.innerHTML = addComma(value02['price'].toString());
						}
						return value02;
					});
					let spanOrderListQuantity = event.target.parentElement.parentElement.querySelector('.spanOrderListQuantity');
					++spanOrderListQuantity.innerHTML;
					console.log(TopContainer.arrProductInfo);
					this.bottomContainer.printAllCount();
					this.bottomContainer.printAmount();
				});
			});
			console.log(TopContainer.arrProductInfo);
		}
		deleteProductItem(arrProductInfo) {
			document.querySelectorAll('.iCloseIcon').forEach((value) => {
				value.addEventListener('click', (event) => {
					console.log(event.target.parentElement.querySelector('input[type="hidden"]').value);
					arrProductInfo = arrProductInfo.filter((value02) => {
						return value02['id'] != event.target.parentElement.querySelector('input[type="hidden"]').value;
					});
					event.target.parentElement.remove();
					TopContainer.arrProductInfo = arrProductInfo;
					console.log(arrProductInfo);
					const spanOrderTotal = document.querySelector('.spanOrderTotal');
					const spanOrderQuantity = document.querySelector('.spanOrderQuantity');
					spanOrderTotal.textContent = addComma(subComma(spanOrderTotal.textContent) - subComma(event.target.parentElement.querySelector('.spanOrderListPrice').textContent));
					spanOrderQuantity.textContent = addComma(subComma(spanOrderQuantity.textContent) - subComma(event.target.parentElement.querySelector('.spanOrderListQuantity').textContent));
				});
			});
		}
	}
	class BottomContainer {
		constructor() {}
		printAmount() {
			document.querySelector('.spanOrderQuantity').innerHTML = TopContainer.arrProductInfo.reduce((pre, cur) => {
				cur = cur['quantity'];
				return pre + cur;
			}, 0);
		}
		printAllCount() {
			document.querySelector('.spanOrderTotal').innerHTML = addComma(
				TopContainer.arrProductInfo.reduce((pre, cur) => {
					cur = cur['price'];
					return pre + cur;
				}, 0)
			);
		}

		inputMoneyPayment() {
			const inputMoneyReceived = document.querySelector('.inputMoneyReceived');
			// x.replace(/\B(?=(\d{3})+(?!\d))/g, ","
			const regEx01 = /^[\d]{1,10}$/;
			inputMoneyReceived.addEventListener('keypress', ({ currentTarget }) => {
				currentTarget.value = currentTarget.value.replace(/[^\d]+/, '');
				if (!regEx01.test(currentTarget.value)) {
					currentTarget.value = currentTarget.value.replace(currentTarget.value, '');
				}
			});
			document.querySelector('.buttonCashRegister').addEventListener('click', () => {
				const spanOrderTotal = document.querySelector('.spanOrderTotal');
				const spanCashRegister = document.querySelector('.spanCashRegister');
				const ulPaymentContainer = document.querySelector('.ulPaymentContainer');
				const ulOrderListContainer = document.querySelector('.ulOrderListContainer');
				ulPaymentContainer.innerHTML = '';
				if (inputMoneyReceived.value == '') {
					ulPaymentContainer.innerHTML = '주문을 먼저 해주세요.';
				} else {
					if (parseInt(subComma(spanOrderTotal.innerHTML)) - parseInt(subComma(inputMoneyReceived.value)) > 0) {
						ulPaymentContainer.innerHTML = addComma(Math.abs(parseInt(subComma(spanOrderTotal.innerHTML)) - parseInt(subComma(inputMoneyReceived.value))).toString()) + '원 부족합니다.';
					} else if (inputMoneyReceived.value != '' && ulOrderListContainer.innerHTML != '') {
						ulPaymentContainer.innerHTML = `
							<li class="liPaymentContainer"><span class="spanPayment">50,000</span><span class="spanPaymentQuantity">0</span></li>
							<li class="liPaymentContainer"><span class="spanPayment">10,000</span><span class="spanPaymentQuantity">0</span></li>
							<li class="liPaymentContainer"><span class="spanPayment">5,000</span><span class="spanPaymentQuantity">0</span></li>
							<li class="liPaymentContainer"><span class="spanPayment">1,000</span><span class="spanPaymentQuantity">0</span></li>
							<li class="liPaymentContainer"><span class="spanPayment">500</span><span class="spanPaymentQuantity">0</span></li>
							<li class="liPaymentContainer"><span class="spanPayment">100</span><span class="spanPaymentQuantity">0</span></li>
							<li class="liPaymentContainer"><span class="spanPayment">50</span><span class="spanPaymentQuantity">0</span></li>
							<li class="liPaymentContainer"><span class="spanPayment">10</span><span class="spanPaymentQuantity">0</span></li>
						`;
						spanCashRegister.innerHTML = addComma((parseInt(subComma(inputMoneyReceived.value)) - parseInt(subComma(spanOrderTotal.innerHTML))).toString());
						console.log(subComma(spanCashRegister.textContent));
						const spanPaymentQuantity = document.querySelectorAll('.spanPaymentQuantity');
						spanPaymentQuantity[0].textContent = addComma(Math.floor(parseInt(subComma(spanCashRegister.textContent)) / 50000).toString());
						spanPaymentQuantity[1].textContent = addComma(
							Math.floor((parseInt(subComma(spanCashRegister.textContent)) - parseInt(subComma(spanPaymentQuantity[0].textContent)) * 50000) / 10000).toString()
						);
						spanPaymentQuantity[2].textContent = addComma(
							Math.floor(
								(parseInt(subComma(spanCashRegister.textContent)) - parseInt(subComma(spanPaymentQuantity[0].textContent)) * 50000 - parseInt(subComma(spanPaymentQuantity[1].textContent)) * 10000) /
									5000
							).toString()
						);

						// ===== //
						spanPaymentQuantity[3].textContent = Math.floor(
							(parseInt(subComma(spanCashRegister.textContent)) -
								parseInt(subComma(spanPaymentQuantity[0].textContent)) * 50000 -
								parseInt(subComma(spanPaymentQuantity[1].textContent)) * 10000 -
								parseInt(subComma(spanPaymentQuantity[2].textContent)) * 5000) /
								1000
						);

						spanPaymentQuantity[4].textContent = Math.floor(
							(parseInt(subComma(spanCashRegister.textContent)) -
								parseInt(subComma(spanPaymentQuantity[0].textContent)) * 50000 -
								parseInt(subComma(spanPaymentQuantity[1].textContent)) * 10000 -
								parseInt(subComma(spanPaymentQuantity[2].textContent)) * 5000 -
								parseInt(subComma(spanPaymentQuantity[3].textContent)) * 1000) /
								500
						);
						spanPaymentQuantity[5].textContent = addComma(
							Math.floor(
								(parseInt(subComma(spanCashRegister.textContent)) -
									parseInt(subComma(spanPaymentQuantity[0].textContent)) * 50000 -
									parseInt(subComma(spanPaymentQuantity[1].textContent)) * 10000 -
									parseInt(subComma(spanPaymentQuantity[2].textContent)) * 5000 -
									parseInt(subComma(spanPaymentQuantity[3].textContent)) * 1000 -
									parseInt(subComma(spanPaymentQuantity[4].textContent)) * 500) /
									100
							).toString()
						);
						spanPaymentQuantity[6].textContent = addComma(
							Math.floor(
								(parseInt(subComma(spanCashRegister.textContent)) -
									parseInt(subComma(spanPaymentQuantity[0].textContent)) * 50000 -
									parseInt(subComma(spanPaymentQuantity[1].textContent)) * 10000 -
									parseInt(subComma(spanPaymentQuantity[2].textContent)) * 5000 -
									parseInt(subComma(spanPaymentQuantity[3].textContent)) * 1000 -
									parseInt(subComma(spanPaymentQuantity[4].textContent)) * 500 -
									parseInt(subComma(spanPaymentQuantity[5].textContent)) * 100) /
									50
							).toString()
						);
						spanPaymentQuantity[7].textContent = Math.floor(
							(parseInt(subComma(spanCashRegister.textContent)) -
								parseInt(subComma(spanPaymentQuantity[0].textContent)) * 50000 -
								parseInt(subComma(spanPaymentQuantity[1].textContent)) * 10000 -
								parseInt(subComma(spanPaymentQuantity[2].textContent)) * 5000 -
								parseInt(subComma(spanPaymentQuantity[3].textContent)) * 1000 -
								parseInt(subComma(spanPaymentQuantity[4].textContent)) * 500 -
								parseInt(subComma(spanPaymentQuantity[5].textContent)) * 100 -
								parseInt(subComma(spanPaymentQuantity[6].textContent)) * 50) /
								10
						);
						const regEx02 = /[0]$/;
						if (!regEx02.test(inputMoneyReceived.value)) {
							ulPaymentContainer.textContent = '최소 10원 단위로 지불해주세요.';
							spanCashRegister.textContent = 0;
						}
					}
				}
				if (inputMoneyReceived.value == '' && ulOrderListContainer.textContent != '') {
					ulPaymentContainer.textContent = '금액을 지불해주세요.';
				}
				if (inputMoneyReceived.value != '' && ulOrderListContainer.textContent == '') {
					ulPaymentContainer.textContent = '주문을 먼저 해주세요.';
					spanCashRegister.textContent = 0;
				}
				inputMoneyReceived.value = inputMoneyReceived.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			});
		}

		allReset() {
			document.querySelector('.buttonReset').addEventListener('click', () => {
				TopContainer.arrProductInfo = [];
				this.printAllCount();
				this.printAmount();
				this.inputMoneyPayment();
				const inputMoneyReceived = document.querySelector('.inputMoneyReceived');
				const ulOrderListContainer = document.querySelector('.ulOrderListContainer');
				const spanCashRegister = document.querySelector('.spanCashRegister');
				const ulPaymentContainer = document.querySelector('.ulPaymentContainer');
				inputMoneyReceived.value = '';
				spanCashRegister.innerHTML = 0;
				ulOrderListContainer.innerHTML = '';
				ulPaymentContainer.innerHTML = `
					<li class="liPaymentContainer"><span class="spanPayment">50,000</span><span class="spanPaymentQuantity">0</span></li>
					<li class="liPaymentContainer"><span class="spanPayment">10,000</span><span class="spanPaymentQuantity">0</span></li>
					<li class="liPaymentContainer"><span class="spanPayment">5,000</span><span class="spanPaymentQuantity">0</span></li>
					<li class="liPaymentContainer"><span class="spanPayment">1,000</span><span class="spanPaymentQuantity">0</span></li>
					<li class="liPaymentContainer"><span class="spanPayment">500</span><span class="spanPaymentQuantity">0</span></li>
					<li class="liPaymentContainer"><span class="spanPayment">100</span><span class="spanPaymentQuantity">0</span></li>
					<li class="liPaymentContainer"><span class="spanPayment">50</span><span class="spanPaymentQuantity">0</span></li>
					<li class="liPaymentContainer"><span class="spanPayment">10</span><span class="spanPaymentQuantity">0</span></li>
				`;
			});
		}
	}
	class CashRegister {
		constructor() {
			this.topContainer = new TopContainer();
		}
		main() {
			this.topContainer.createProductItem();
		}
	}

	window.addEventListener('load', () => {
		try {
			const xmlHttp = new XMLHttpRequest();
			xmlHttp.open('POST', './php/menuInfo.php', true);
			xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xmlHttp.send('page=home');
			xmlHttp.onreadystatechange = async () => {
				if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
					TopContainer.arrDoughnutInfo = await JSON.parse(xmlHttp.responseText);
					TopContainer.arrDoughnutInfo.forEach((value) => {
						document.querySelector('.ulProductContainer').innerHTML += `
						<li class="liProductContainer">
							<input type="hidden" name="productIndex" value="${value['id']}">
							<div class="divProductImageContainer" style="background-image:url(${value['imageUrl']})"></div>
							<div class="divProductInformationContainer">
								<h2 class="h2ProductTitle">${value['productName']}</h2>
								<span class="spanPrice">${addComma(parseInt(value['price']))}</span>
							</div>
						</li>
					`;
					});
					console.log(TopContainer.arrDoughnutInfo);
					const cashRegister = new CashRegister();
					cashRegister.main();
				}
			};
			const desktopMediaQuery = window.matchMedia('screen and (min-width: 1200px)');
			const tabletMediaQuery = window.matchMedia('only screen and (min-width:768px) and (max-width: 1200px');
			const mobileMediaQuery = window.matchMedia('only screen and (min-width: 360px) and (max-width: 767px)');

			window.addEventListener('resize', () => {
				if (desktopMediaQuery.matches) {
					window.location.reload();
				}
				if (tabletMediaQuery.matches) {
					window.location.reload();
				}
				if (mobileMediaQuery.matches) {
					window.location.reload();
				}
			});
		} catch (error) {
			console.log(error);
		} finally {
			console.log('success!');
		}
	});
})();
