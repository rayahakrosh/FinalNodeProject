const API_URL = '/p'; 
const h1 = document.getElementById('h1');
const idInput = document.getElementById('id');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description'); 
const priceInput = document.getElementById('price');
const fileInput = document.getElementById('myFile');
const imagePreview = document.getElementById('myImage');
const mainDiv = document.getElementById('main');
const productForm = document.getElementById('productForm');

function showMessage(text, isError = false) {
    const msgBox = document.getElementById('messageBox');
    const element = document.createElement('div');
    element.className = isError ? 'msg-error' : 'msg-success'; 
    element.textContent = text;
    msgBox.appendChild(element);
    setTimeout(() => element.remove(), 3000);
}

function resetForm() {
    productForm.reset();
    h1.textContent = 'הוספת פרויקט חדש';
    fileInput.required = true; 
    imagePreview.src = '';
    imagePreview.classList.add('hidden-img'); 
    idInput.value = '';
}

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.classList.remove('hidden-img');
    } else {
        imagePreview.classList.add('hidden-img');
    }
});


productForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const id = idInput.value;
    const method = id ? 'PATCH' : 'POST'; 
    const endpoint = id ? `${API_URL}/${id}` : API_URL;

    const formData = new FormData(productForm); 

    if (id && !fileInput.files.length) {
        formData.delete('myFile');
    }
    
    try {
        const response = await fetch(endpoint, {
            method: method,
            body: formData 
        });

        const result = await response.json();

        if (response.ok) {
            showMessage(id ? 'הפרויקט עודכן בהצלחה!' : 'הפרויקט נוסף בהצלחה!');
            resetForm();  
            getData(); 
        } else {
            showMessage(`שגיאה: ${result.message || 'כשלון בשמירה.'}`, true);
        }
    } catch (error) {
        console.error('Submit Error:', error);
        showMessage('שגיאה בתקשורת עם השרת.', true);
    }
});

async function viewProduct(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const product = await response.json();
        
        if (response.ok) {
            h1.textContent = `עריכת פרויקט: ${product.name}`;
            idInput.value = product.id;
            nameInput.value = product.name;
            descriptionInput.value = product.description;
            priceInput.value = product.price;
            fileInput.required = false; 
            
            const imagePath = `/images/${product.myFileName}`;
            imagePreview.src = imagePath;
            imagePreview.classList.remove('hidden-img');
            imagePreview.onerror = () => { imagePreview.src = 'https://placehold.co/150x100?text=תמונה+חסרה'; };

        } else {
            showMessage(`שגיאה בטעינת פרויקט: ${product.message}`, true);
        }
    } catch (error) {
        showMessage('שגיאה בתקשורת.', true);
    }
}

async function deleteProduct(id) {
    if (!confirm('האם אתה בטוח שברצונך למחוק פרויקט זה?')) return; 
    
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

        if (response.ok) {
            showMessage('הפרויקט נמחק בהצלחה!');
            getData(); 
            resetForm(); 
        } else {
            const result = await response.json();
            showMessage(`שגיאה במחיקה: ${result.message || 'כשלון במחיקה.'}`, true);
        }
    } catch (error) {
        showMessage('שגיאה בתקשורת.', true);
    }
}


async function rateProject(id) {
    try {
        const response = await fetch(`${API_URL}/rate/${id}`, { method: 'PATCH' });
        const result = await response.json();

        if (response.ok) {
            showMessage('הדירוג עודכן בהצלחה!');
            getData(); 
        } else {
            showMessage(`שגיאה בדירוג: ${result.message || 'כשלון בעדכון הדירוג.'}`, true);
        }
    } catch (error) {
        showMessage('שגיאה בתקשורת.', true);
    }
}

function createGrid(products) {
    mainDiv.innerHTML = ''; 
    
    if (products.length === 0) {
        mainDiv.innerHTML = '<p style="text-align: center; color: gray;">אין פרויקטים להצגה.</p>';
        return;
    }

    products.forEach(product => {
        const ratingStars = '⭐'.repeat(product.rating || 0);

        const cardHTML = `
            <div onclick="viewProduct(${product.id})" class="product-card">
                <img src="/images/${product.myFileName}" alt="${product.name}" 
                     onerror="this.onerror=null;this.src='https://placehold.co/250x120?text=תמונה+חסרה';">
                <div class="card-details">
                    <h3>${product.name}</h3>
                    <p>מחיר: ₪${product.price}</p>
                    <p>דירוג: ${ratingStars} (${product.rating || 0})</p>
                    <button onclick="event.stopPropagation(); rateProject(${product.id})" style="background-color: green; color: white;">
                         דרג (+1)
                    </button>
                    <button onclick="event.stopPropagation(); deleteProduct(${product.id})" style="background-color: red; color: white;">
                         מחק
                    </button>
                </div>
            </div>
        `;
        mainDiv.insertAdjacentHTML('beforeend', cardHTML);
    });
}

async function getData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        data.sort((a, b) => (b.rating || 0) - (a.rating || 0)); 
        createGrid(data);
    } catch (error) {
        console.error('Fetch error:', error);
        showMessage('שגיאה בשליפת נתונים מהשרת.', true);
    }
}

getData(); 
resetForm(); 
