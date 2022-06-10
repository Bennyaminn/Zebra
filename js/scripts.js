// Wczytanie produktów po wybraniu zakładki all products
document.addEventListener("DOMContentLoaded", function () {
    //Inicjalizacja slidera, oraz licznika koszyka
    $('.carousel').carousel({
        interval: 5000
    });

    //Inicjalizacja licznika koszyka
    var list = JSON.parse(sessionStorage.getItem('list'));
    if (list === null) {
        document.getElementById("cartAmmount").innerHTML = 0;
    } else
        document.getElementById("cartAmmount").innerHTML = JSON.parse(sessionStorage.getItem('list')).length;

    //Inicjalizacja przycisku wysiwetlajacego wszystkie produkty
    var all_products = document.getElementById("all_products");
    all_products.addEventListener('click', async () => {

        products = await loadProducts();
        var tresc = `
                        <div class="container px-4 px-lg-5 mt-5">
                           <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                    `;
        for (var i = 0; i < products.length; i++) {
            dane2 = await getProduct(products[i]);
            tresc += '<div class="col mb-5"><div class="card h-100">';
            //wyprzedaz
            if (dane2.sale)
                tresc += '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>';
            //obrazek
            tresc += '<img class="card-img-top" src="assets/' + dane2.image + '" alt="' + dane2.name + '" />';
            //nazwa
            tresc += '<div class="card-body p-4"><div class="text-center">';
            tresc += '<h5 class="fw-bolder">' + dane2.name + '</h5>';
            //Ocena produktu
            if (dane2.rating > 0 && dane2.rating < 6) {
                tresc += '<div class="d-flex justify-content-center small text-warning mb-2">';
                for (var j = 0; j < dane2.rating; j++)
                    tresc += '<div class="bi-star-fill"></div>';
                for (var j = 0; j < 5 - dane2.rating; j++)
                    tresc += '<div class="bi-star"></div>';
                tresc += '</div>';
            }
            if (dane2.sale)
                tresc += '<span class="text-muted text-decoration-line-through">' + dane2.old_price + 'zł</span>&nbsp;';
            else
                tresc += '</br>';
            tresc += dane2.price + 'zł';
            tresc += `</div></div><div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                        <div class="text-center"><a class="btn btn-outline-dark mt-auto" onclick="modalShow('` + products[i] + `')">Więcej informacji</a></div>
                                      </div>
                                    </div>
                                 </div>`;
        }
        tresc += '</div></div>';
        document.getElementsByTagName("section")[0].innerHTML = tresc;
    },
            false);

    //Inicjalizacja przysciku wyświetlającego koszyk 
    document.getElementById("show_cart").addEventListener('click', async () => {
        var list = JSON.parse(sessionStorage.getItem('list'));
        if (list === null) {
            document.getElementsByTagName("section")[0].innerHTML = '<h1 class="text-center" >Brak produktów w koszyku</h1>';
        } else {
            var tresc = `
                    <div class="container px-0 px-lg-2 my-5">
                        <div class="row gx-4 gx-lg-5">
                            <div class="col-md-7 mb-5">`;
            tresc += createForm();
            //<img class="card-img-top mb-5 mb-md-0" src="https://dummyimage.com/600x700/dee2e6/6c757d.jpg" alt="..." />
            tresc += '</div><div class="col-md-5" id="cart" >';
            tresc += await loadCart(list);

            tresc += '</div></div></div>';
            document.getElementsByTagName("section")[0].innerHTML = tresc;
        }
    },
            false);

    document.getElementById("show_about").addEventListener('click', async () => {
        tresc = `<div class="container px-4 px-lg-5 mt-5">
                    <h2>Dziękujemy za odzwiedzenie naszego sklepu</h2>
                    <h3>Zachęcamy do odwiedzenia naszego sklepu stacjonarnie</h3>
                    <div class="row gx-4 gx-lg-5 row">
                        <div class="col-6 mb-5">
                        <h7 class="text-warning">(Naciśnij po więcej informacji)</h7><br/>
                        <span class="text-secondary handover" onclick="initialize(54.382870897682274, 18.60505218958076)">
                            Galeria Metropolia<br/>
                            Jana Kilińskiego 4<br/>
                            80-452 Gdańsk<br/>
                            +48 999 888 777<br/>
                        <span><br/>
                        <span class="text-secondary handover" onclick="initialize(52.17973493121733, 21.004070169586413)">
                            Galeria Mokotów<br/>
                            Wołoska 12<br/>
                            02-675 Warszawa<br/>
                            +48 888 999 777<br/>
                        <span><br/>
                        <span class="text-secondary handover" onclick="initialize(51.26587909763713, 22.570682198396042)">
                            Galeria Olimp<br/>
                            Aleja Spółdzielczości Pracy 34<br/>
                            20-147 Lublina<br/>
                            +48 777 999 888<br/>
                        <span>
        
                        
                        </div>
                        <div class="col-6 mb-5" id="map">
                        </div>
                        
                </div></div></div>    
                `;
        document.getElementsByTagName("section")[0].innerHTML = tresc;
        initialize(54.382870897682274, 18.60505218958076);
    },
            false);


    document.getElementById("show_main").addEventListener('click', async () => {
            document.getElementsByTagName("section")[0].innerHTML = `
            <h3 class="text-center mb-5">Zamawiaj z nami już dziś!</h3>
            <div class="row px-5 mx-5">
                <div class="col-sm-12 col-md-12 col-lg-6"><img src="assets/zebra_main.jpg" alt="zebra"/></div>
                <div class="col-sm-12 col-md-12 col-lg-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum leo non ornare aliquam. Nulla ante turpis, condimentum a laoreet non, imperdiet vitae ipsum. Aenean nec orci in nisi fermentum pretium. Donec ac eleifend velit, quis euismod mi. Ut sodales turpis interdum nisi cursus imperdiet. Pellentesque lobortis sapien vitae felis dignissim, laoreet tristique urna egestas. Cras vitae urna neque. Nulla pharetra, orci a fermentum elementum, risus felis placerat dolor, eget molestie turpis metus at magna. Proin at arcu tincidunt, dignissim nibh ac, venenatis ipsum. Proin hendrerit elit vitae justo aliquam lobortis. Curabitur ac consequat lectus, a congue ipsum. In suscipit pellentesque diam in aliquet. Maecenas sed urna ut elit varius pretium. Cras fringilla, sem ut sagittis rutrum, ligula magna placerat nulla, vitae sollicitudin justo est eget risus. Donec faucibus in nunc et vestibulum.

                Cras purus nisl, pretium vel ipsum venenatis, ultricies sodales tellus. Nunc eros magna, pharetra sit amet tellus nec, maximus facilisis dui. Curabitur sollicitudin elit leo, quis sodales lectus feugiat in. Nulla tincidunt fringilla justo, in placerat tellus congue ut. Praesent maximus urna tincidunt sem suscipit cursus. Fusce iaculis ullamcorper elit a congue. Sed et fermentum elit, eget pretium eros. Nulla eu tellus in justo hendrerit porttitor. Mauris eu sapien non neque viverra tempus vel quis augue. Aenean fringilla porttitor felis sed venenatis.</div>
             </div> 
            
            `;
        
    },
            false);

});

function initialize(lat, lng) {
    document.getElementById("map").innerHTML = '';
    var myCenter = new google.maps.LatLng(lat, lng);
    var mapProp = {
        center: myCenter,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapProp);

    var marker = new google.maps.Marker({
        position: myCenter,
    });

    marker.setMap(map);
}

async function loadCart(list) {
    var tresc = '';
    var kwota = 0;
    for (var i = 0; i < list.length; i++) {
        tresc += '<div class="card mb-3"><div class="row">';
        const product = await getProduct(list[i].data);
        tresc += '<img class="card-img-top h-50 w-50 col-5" src="assets/' + product.image + '" alt="' + product.name + '" />';
        tresc += '<div class="col-6 py-2">';
        tresc += '<button class="badge bg-dark text-white position-absolute" autocomplete="off" onclick="deleteFromCart(\'' + list[i].data + '\')" style="bottom: 0.25rem; right: 0.25rem"><i class="bi bi-trash-fill"></i></button>';
        tresc += '<h5 class="fw-bolder">' + product.name + '</h5>';
        kwota += list[i].ammount * product.price;
        tresc += 'Liczba sztuk: ' + list[i].ammount + '</br>Łączna cena: ' + ((list[i].ammount * product.price)) + 'zł';
        tresc += '</div></div></div>';
    }

    return '<h3>Łącznie do zapłaty: ' + kwota + 'zł</h3>' + tresc;
}

function createForm() {
    return `
                        <h3>Dane do dostawy</h3>
                        <table>
                            <tr>
                                <td><label for="imie">Imie:</label></td>
                                <td><input type="text" id="imie" name="imie"/></td>
                            </tr>
                            <tr>
                                <td id="imie_error" colspan="2" class="text-danger"></td>
                            </tr>
                            <tr>
                                <td><label for="nazwisko">Nazwisko:</label></td>
                                <td><input type="text" id="nazwisko" name="nazwisko"/></td>
                                
                            </tr>
                            <tr>
                                <td id="nazw_error" colspan="2" class="text-danger"></td>
                            </tr>
                            <tr>
                                <td><label for="telefon">Numer telefonu:</label></td>
                                <td><input id="numer_telefonu"  name="numer_telefonu"/></td>
                            </tr>
                            <tr>
                                <td id="numer_error" colspan="2" class="text-danger"></td>
                            </tr>
                            <tr>
                                <td><label for="email">Adres e-mail:</label>
                                </td><td><input id="email" type="text" name="email"/></td>
                            </tr>
                            <tr>
                                <td id="email_error" colspan="2" class="text-danger"></td>
                            </tr>
                        </table>
                        <h3>Adres dostawy</h3>
                         <table>
                            <tr>
                                <td>Miasto:</td>
                                <td><select id="miasto">
                                    <option value="Warszawa" selected="selected">Warszawa</option>
                                    <option value="Gdańsk">Gdańsk</option>
                                    <option value="Lublin">Lublin</option>
                                    <option value="Rzeszów">Rzeszów</option>
                                    <option value="Sopot">Sopot</option>
                                    <option value="Kraków">Kraków</option>
                                    <option value="Poznań">Poznań</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label for="ulica">Ulica:</label></td>
                                <td><input type="text" id="ulica" name="ulica"/></td>
                            </tr>
                            <tr>
                                <td id="ulica_error" colspan="2" class="text-danger"></td>
                            </tr>
                            <tr>
                                <td><label for="nr_dom">Numer domu/mieszkania:</label></td>
                                <td><input type="text" id="nr_dom" name="nr_dom"/></td>
                            </tr>
                            <tr>
                                <td id="nr_dom_error" colspan="2" class="text-danger"></td>
                            </tr>
                            <tr>
                                <td><label for="kod_pocztowy">Kod pocztowy:</label></td>
                                <td><input type="text" id="kod_pocztowy" name="kod_pocztowy"/></td>
                            </tr>
                            <tr>
                                <td id="kod_pocztowy_error" colspan="2" class="text-danger"></td>
                            </tr>
                        </table>
                        <h4>Sposób zapłaty</h4>
                            <input type="radio" name="sposob_zaplaty" value="Eurocard" checked /> Eurocard
                            <input type="radio" name="sposob_zaplaty" value="Visa" /> Visa
                            <input type="radio" name="sposob_zaplaty" value="Przelew bankowy" /> Przelew bankowy 
                            <span id="zaplata_error" class="text"></span><br /><br/>
    
                            
                            <input type="checkbox" value="zasady" id="zasady" name="akceptacje"/> Akceptuje regulamin strony*<br/>
                            <input type="checkbox" value="przetw_danych" name="akceptacje"/> Zezwalam na przetważanie danych osobowych<br/>
                            <input type="checkbox" value="reklamy" name="akceptacje"/> Chcę otrzymywać informację o nowych ofertach<br/>
                            <span id="akceptacje_error" class="text-danger"></span><br/>
                            

                            
                        <input type="submit" value="Zatwierdź" onclick="validation()" />`;

}

function sprawdzPole(pole_id, obiektRegex) {
    var obiektPole = document.getElementById(pole_id);
    if (!obiektRegex.test(obiektPole.value))
        return (false);
    else
        return (true);
}

function validation() {
    var ok = true;
    obiektPodst = /^[A-ZĘÓĄŚŁŻŹĆŃ][a-zęóąśłżźćń]{2,20}$/;
    obiektNumer = /^[0-9]{9}$/;
    obiektemail =
            /^([a-zA-Z0-9])+([.a-zA-Z0-9_-])*@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+/;
    obiektNrDom = /^[0-9]{1,}[a-zA-Z]?$/;
    obiektKod = /^[0-9]{2}-[0-9]{3}?$/;
    obiektUlica = /[A-ZĘÓĄŚŁŻŹĆŃa-zęóąśłżźćń\s]{1,30}/;


    if (!sprawdzPole("imie", obiektPodst))
    {
        ok = false;
        document.getElementById("imie_error").innerHTML =
                "Wpisz poprawnie imię!";
    } else {
        document.getElementById("imie_error").innerHTML = "";
    }

    if (!sprawdzPole("nazwisko", obiektPodst))
    {
        ok = false;
        document.getElementById("nazw_error").innerHTML =
                "Wpisz poprawnie Nazwisko!";
    } else {
        document.getElementById("nazw_error").innerHTML = "";
    }

    if (!sprawdzPole("numer_telefonu", obiektNumer))
    {
        ok = false;
        document.getElementById("numer_error").innerHTML =
                "Wpisz poprawnie numer telefonu!";
    } else {
        document.getElementById("numer_error").innerHTML = "";
    }

    if (!sprawdzPole("email", obiektemail))
    {
        ok = false;
        document.getElementById("email_error").innerHTML =
                "Wpisz poprawnie adres email!";
    } else {
        document.getElementById("email_error").innerHTML = "";
    }

    if (!sprawdzPole("ulica", obiektUlica))
    {
        ok = false;
        document.getElementById("ulica_error").innerHTML =
                "Wpisz poprawnie ulicę!";
    } else {
        document.getElementById("ulica_error").innerHTML = "";
    }

    if (!sprawdzPole("nr_dom", obiektNrDom))
    {
        ok = false;
        document.getElementById("nr_dom_error").innerHTML =
                "Wpisz poprawnie numer domu!";
    } else {
        document.getElementById("nr_dom_error").innerHTML = "";
    }

    if (!sprawdzPole("kod_pocztowy", obiektKod))
    {
        ok = false;
        document.getElementById("kod_pocztowy_error").innerHTML =
                "Wpisz poprawnie kod pocztowy!";
    } else {
        document.getElementById("kod_pocztowy_error").innerHTML = "";
    }

    if (!document.getElementById("zasady").checked) {
        document.getElementById("akceptacje_error").innerHTML = "Należy zaakceptować regulamin!";
        ok = false;
    } else
        document.getElementById("akceptacje_error").innerHTML = "";

    if (ok) {
        document.getElementsByTagName("section")[0].innerHTML = '<h1 class="text-center text-success">Dokonano zakupu!</h1>';
        document.getElementById("cartAmmount").innerHTML = 0;
        sessionStorage.removeItem("list");
    }
}

async function deleteFromCart(product_) {
    var list = JSON.parse(sessionStorage.getItem('list'));
    for (var i = 0; i < list.length; i++) {
        if (list[i].data === product_) {
            list.splice(i, 1);
            sessionStorage.setItem('list', JSON.stringify(list));
        }
    }
    if (list.length === 0) {
        document.getElementsByTagName("section")[0].innerHTML = '<h1 class="text-center" >Brak produktów w koszyku</h1>';
        sessionStorage.removeItem("list");
    } else
        document.getElementById("cart").innerHTML = await loadCart(list);

    document.getElementById("cartAmmount").innerHTML = parseInt(document.getElementById("cartAmmount").innerHTML) - 1;
}

//Asynchorniczne pobranie listy dostepnych produktow
async function loadProducts() {
    const response = await fetch('dane/all_product_names.json');
    const products = await response.json();
    return products;
}

//Asynchorniczne pobranie danych o wskazanym produkcie
async function getProduct(dane) {
    const response = await fetch("dane/" + dane);
    const product = await response.json();
    return product;
}

//Dodanie poroduktu do koszyka
function addToCart(product_) {
    var list = JSON.parse(sessionStorage.getItem('list'));
    if (list === null)
        list = [];
    var flag = true;
    for (var i = 0; i < list.length; i++) {
        if (list[i].data === product_) {
            list[i].ammount += parseInt(document.getElementById('modalQuantity').value);
            flag = false;
        }
    }
    if (flag) {
        var product = {};
        product.data = product_;
        product.ammount = parseInt(document.getElementById('modalQuantity').value);
        list.push(product);
        document.getElementById("cartAmmount").innerHTML = parseInt(document.getElementById("cartAmmount").innerHTML) + 1;
    }

    sessionStorage.setItem('list', JSON.stringify(list));
    $('#modal').modal('hide');
}

//Wyświetlenie okna dialogowego
async function modalShow(product_) {
    product = await getProduct(product_);
    document.getElementById("modalImage").innerHTML = '<img class="card-img-top mb-5 mb-md-0" src="assets/' + product.image + '" alt="' + product.name + '" />'
    document.getElementById("modalProduct").innerHTML = product.name;
    helper = "";
    if (product.sale) {
        helper += '<span class="text-decoration-line-through">' + product.old_price + 'zł</span>';
    }
    helper += '<span>&nbsp;' + product.price + 'zł</span>';
    document.getElementById('modalPrice').innerHTML = helper;
    document.getElementById("modalDescription").innerHTML = product.description;
    document.getElementById("modalButton").onclick = function () {
        addToCart(product_);
    };
    $('#modal').modal('show');
}