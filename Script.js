//=================================================//
// Fungsi untuk menjalankan Jam Digital Real-time  //
//=================================================//
function jalankanJam() {
    const elJam = document.getElementById('jam-jalan');
    if (!elJam) return;
    
    setInterval(() => {
        const sekarang = new Date();
        
        // Format Waktu: 10:29:15
        const jam = sekarang.getHours().toString().padStart(2, '0');
        const menit = sekarang.getMinutes().toString().padStart(2, '0');
        const detik = sekarang.getSeconds().toString().padStart(2, '0');
        
        // Format Tanggal: Kamis, 01 Jan 2026
        const opsiTanggal = { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        };
        const tanggalLengkap = sekarang.toLocaleDateString('id-ID', opsiTanggal);
        
        // Gabungkan: 🕒 10:29:15 | Kamis, 01 Jan 2026
        elJam.innerHTML = `🕒 ${jam}:${menit}:${detik} | ${tanggalLengkap}`;
    }, 1000);
}

// Panggil fungsi jam saat halaman dimuat
document.addEventListener('DOMContentLoaded', jalankanJam);

//=================================================//
//            Index.html/Halaman Login             //
//=================================================//
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah form submit default

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            // Ambil nilai peran yang dipilih (customer atau admin)
            const selectedRole = document.querySelector('input[name="role"]:checked').value;

            if (email && password) {
                // Logika Pengalihan Halaman Berdasarkan Peran
                let redirectUrl = '';

                if (selectedRole === 'admin') {
                    // Jika peran yang dipilih adalah Admin
                    redirectUrl = 'AdminDashboard.html'; // Ganti dengan URL dashboard admin Anda
                    alert('Login sebagai Admin sedang diproses. Mengalihkan ke Dashboard Admin...');
                } else if (selectedRole === 'customer') {
                    // Jika peran yang dipilih adalah Customer
                    redirectUrl = 'HalamanDashboard.html'; // Ganti dengan URL dashboard customer Anda
                    alert('Login sebagai Customer sedang diproses. Mengalihkan ke Dashboard Customer...');
                }

                // Simulasikan berhasil login dan redirect
                // Aktifkan baris di bawah ini saat Anda siap untuk pengalihan halaman yang sebenarnya
                window.location.href = redirectUrl;

            } else {
                alert('Mohon masukkan Email/Username dan Password.');
            }
        });
    }
});

//=================================================//
//                Katalog&Layanan.html             //
//=================================================//

let cart = [];

// --- UTILITY FUNCTIONS ---
if (!window.formatRupiah) {
    window.formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };
}

// --- CART DISPLAY FUNCTION ---
window.updateCartDisplay = function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalDisplay = document.getElementById('cart-total');
    const cartCountDisplay = document.getElementById('cart-count');
    const checkoutButton = document.getElementById('checkout-button');
    const clearCartButton = document.getElementById('clear-cart-button');

    if (!cartItemsContainer) return; // Exit if element doesn't exist on this page

    cartItemsContainer.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="placeholder-text">Keranjang kosong.</div>';
        checkoutButton.disabled = true;
        clearCartButton.disabled = true;
    } else {
        checkoutButton.disabled = false;
        clearCartButton.disabled = false;
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            totalItems += item.quantity;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-row');

            const itemLabel = item.is_proposal ? ' (Pengajuan)' : (item.is_ai ? ' (Draft AI)' : ` (${item.quantity}x)`);

            itemDiv.innerHTML = `
                <span class="item-name">${item.name} ${itemLabel}</span>
                <span class="item-price">${item.price > 0 ? formatRupiah(subtotal) : 'Rp 0'}</span>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
    }

    cartTotalDisplay.textContent = formatRupiah(total);
    cartCountDisplay.textContent = totalItems;

    localStorage.setItem('current_cart', JSON.stringify(cart));
};

// --- SERVICE SWITCHING LOGIC (New) ---
function showService(serviceId) {
    // Hide all service sections first
    document.querySelectorAll('.service-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const sectionToShow = document.getElementById(`${serviceId}-section`);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    }
}

// --- CART LOGIC ---
function addToCart(itemId) {
    const itemElement = document.querySelector(`.service-card[data-id="${itemId}"]`);
    if (!itemElement) return;

    const itemName = itemElement.dataset.name;
    const itemPrice = parseInt(itemElement.dataset.price);

    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1 });
    }

    updateCartDisplay();
    alert(`${itemName} telah ditambahkan ke keranjang!`);
}
    
    // --- MANUAL CUSTOM LOGIC ---
    function submitProposal(event) {
        event.preventDefault(); 

        const form = document.getElementById('customProposalForm');
        const kebutuhan = form.kebutuhan.value;
        const tema = form.tema.value;
        const anggaranValue = Number(form.anggaran.value); 
        const detail = form.detail_proyek.value;

        if (anggaranValue < 10000000) {
            alert("Anggaran minimum untuk proyek kustom adalah Rp 10.000.000. Mohon masukkan nilai yang sesuai.");
            return;
        }
        
        const anggaranDisplay = formatRupiah(anggaranValue).replace('Rp', 'Rp ');

        if (!kebutuhan || !tema || !anggaranValue || !detail) {
            alert("Mohon lengkapi semua bidang penawaran.");
            return;
        }

        const confirmationMessage = 
            `KONFIRMASI PENAWARAN KUSTOM MANUAL:\n\n` +
            `Kebutuhan: ${kebutuhan}\n` +
            `Tema/Gaya: ${tema}\n` +
            `Anggaran Anda: ${anggaranDisplay}\n` +
            `Detail Proyek: ${detail.substring(0, 70)}...\n\n` +
            `Apakah Anda yakin ingin mengajukan penawaran ini ke Admin?`;

        if (confirm(confirmationMessage)) {
            alert("✅ Penawaran kustom manual Anda telah berhasil diajukan! Admin akan meninjau detailnya dan akan segera menghubungi Anda.");
            
            cart.push({ 
                id: `MANUAL-PROPOSAL-${Date.now()}`, 
                name: `Penawaran Kustom (Manual): ${kebutuhan}`, 
                price: 0, 
                quantity: 1,
                is_proposal: true,
                is_ai: false 
            });
            updateCartDisplay();
            form.reset();
            showService('ready-made'); 
        }
    }
    
    // --- AI CUSTOM LOGIC ---
    function submitAiBrief(event) {
        event.preventDefault();
        const keyword = document.getElementById('ai_keyword').value;
        
        if (!keyword) {
            alert("Mohon masukkan deskripsi singkat untuk Asisten AI.");
            return;
        }

        // SIMULASI PROSES GENERATE AI
        const outputArea = document.getElementById('ai-output-area');
        outputArea.style.display = 'block';

        alert(`🤖 AI sedang memproses keyword "${keyword}"... Draft Brief telah berhasil dibuat!`);
        
        // Simulasikan scroll ke area output
        outputArea.scrollIntoView({ behavior: 'smooth' });
    }

    function submitAiToCart() {
        const kebutuhan = document.getElementById('ai_kebutuhan').value;
        const anggaranValue = Number(document.getElementById('ai_anggaran').value);
        const detail = document.getElementById('ai_detail').value;

        const anggaranDisplay = formatRupiah(anggaranValue).replace('Rp', 'Rp ');

        const confirmationMessage = 
            `KONFIRMASI PENGAJUAN DRAFT AI:\n\n` +
            `Kebutuhan: ${kebutuhan}\n` +
            `Anggaran Awal: ${anggaranDisplay}\n` +
            `Detail Proyek: ${detail.substring(0, 70)}...\n\n` +
            `Apakah Anda yakin ingin mengajukan draft brief dari AI ini ke Admin?`;

        if (confirm(confirmationMessage)) {
            alert("✅ Draft Brief dari AI Anda telah berhasil diajukan! Admin akan meninjau detailnya dan segera menghubungi Anda.");
            
            cart.push({ 
                id: `AI-PROPOSAL-${Date.now()}`, 
                name: `Draft Kustom (AI): ${kebutuhan}`, 
                price: 0, 
                quantity: 1,
                is_proposal: true,
                is_ai: true 
            });
            updateCartDisplay();
            document.getElementById('aiBriefingForm').reset();
            document.getElementById('ai-output-area').style.display = 'none'; // Sembunyikan output setelah submit
            showService('ready-made');
        }
    }
    // --- END AI CUSTOM LOGIC ---


    // --- MODAL LOGIC ---
    function showModal() {
        document.getElementById('hargaInfoModal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('hargaInfoModal').style.display = 'none';
    }

    window.onclick = function(event) {
        const modal = document.getElementById('hargaInfoModal');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // --- CHECKOUT/CART FUNCTIONS ---
    function checkout() {
        if (cart.length === 0) {
            alert("Keranjang belanja Anda masih kosong!");
            return;
        }
        
        const pendingProposal = cart.some(item => item.is_proposal);
        if (pendingProposal) {
            alert("Ada pengajuan penawaran kustom yang harus ditinjau oleh Admin terlebih dahulu. Anda akan diarahkan ke halaman Riwayat Pesanan untuk memantau status penawaran Anda.");
            window.location.href = 'HalamanRiwayatPesanan.html';
            return;
        }

        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        localStorage.setItem('checkout_cart', JSON.stringify(cart));
        localStorage.setItem('checkout_total', totalPrice);

        alert(`Simulasi Checkout:\nTotal item siap pakai: ${formatRupiah(totalPrice)}.\nLanjut ke halaman Pembayaran...`);
        
        window.location.href = 'HalamanPembayaran.html';
    }
    
    function clearCart() {
        if (confirm("Apakah Anda yakin ingin menghapus semua item dari keranjang?")) {
            cart = [];
            updateCartDisplay();
        }
    }
    
    // --- INITIALIZATION ---
    document.addEventListener('DOMContentLoaded', () => {
        // Only initialize cart if on a page that has cart elements
        const cartItemsContainer = document.getElementById('cart-items');
        if (cartItemsContainer) {
            const storedCart = localStorage.getItem('current_cart');
            if (storedCart) {
                cart = JSON.parse(storedCart);
            }
            updateCartDisplay();

            // Default tampilan: Koleksi Desain Instan
            showService('ready-made');
        }
    });

//=================================================//
//              HalamanPembayaran.html             //
//=================================================//

window.SERVICE_FEE_PERCENTAGE = 0.02; // 2%
window.selectedMethod = 'bca'; // Default

// Format mata uang Rupiah
window.formatRupiah = function(number) {
    if (isNaN(number) || number === null) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

window.selectPayment = function(method) {
    window.selectedMethod = method;
    document.querySelectorAll('.payment-option').forEach(el => {
        el.classList.remove('selected');
    });
    document.querySelector(`.payment-option[data-method="${method}"]`).classList.add('selected');
};

window.calculateAndDisplaySummary = function(cart, subtotal) {
    const fee = Math.round(subtotal * window.SERVICE_FEE_PERCENTAGE);
    const finalTotal = subtotal + fee;

    document.getElementById('summary-subtotal').textContent = window.formatRupiah(subtotal);
    document.getElementById('summary-fee').textContent = window.formatRupiah(fee);
    document.getElementById('summary-total').textContent = window.formatRupiah(finalTotal);

    // Simpan total akhir ke localStorage (untuk halaman sukses)
    localStorage.setItem('final_checkout_total', finalTotal);
};

window.loadOrderDetails = function() {
    const cartJSON = localStorage.getItem('checkout_cart');
    const subtotal = parseInt(localStorage.getItem('checkout_total') || 0);
    const orderList = document.getElementById('order-items-list');

    if (!orderList) return; // Exit if element doesn't exist

    orderList.innerHTML = '';

    if (!cartJSON || subtotal === 0) {
        orderList.innerHTML = '<div class="placeholder-text" style="color: #dc3545;">❌ Error: Keranjang kosong atau data hilang.</div>';
        const paymentButton = document.getElementById('checkout-payment-button');
        if (paymentButton) paymentButton.disabled = true;
        return;
    }

    const cart = JSON.parse(cartJSON);

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('order-list-item');

        const subItemTotal = item.price * item.quantity;

        itemDiv.innerHTML = `
            <span class="item-name-checkout">${item.name} (${item.quantity}x)</span>
            <span class="item-price-checkout">${window.formatRupiah(subItemTotal)}</span>
        `;
        orderList.appendChild(itemDiv);
    });

    window.calculateAndDisplaySummary(cart, subtotal);
};

window.processPayment = function() {
    if (!window.selectedMethod) {
        alert('Mohon pilih metode pembayaran.');
        return;
    }

    const finalTotal = localStorage.getItem('final_checkout_total');

    if (confirm(`Anda akan melakukan pembayaran sebesar ${window.formatRupiah(parseInt(finalTotal))} menggunakan ${window.selectedMethod.toUpperCase()}. Lanjutkan?`)) {
        // Simulasi proses pembayaran sukses
        localStorage.removeItem('current_cart'); // Kosongkan keranjang setelah checkout

        // Redirect ke halaman sukses
        window.location.href = 'HalamanPembayaranSucces.html';
    }
};

document.addEventListener('DOMContentLoaded', window.loadOrderDetails);

//=================================================//
//          HalamanPembayaranSucces.html           //
//=================================================//

function displaySuccessDetails() {
    const finalTotal = localStorage.getItem('final_checkout_total');
    const totalPaidElement = document.getElementById('total-paid');
    const trxIdElement = document.getElementById('trx-id');

    if (totalPaidElement && trxIdElement) {
        if (finalTotal) {
            totalPaidElement.textContent = window.formatRupiah(parseInt(finalTotal));
            // Hapus data total agar tidak ditampilkan lagi saat refresh
            localStorage.removeItem('checkout_cart');
            localStorage.removeItem('checkout_total');
            localStorage.removeItem('final_checkout_total');
        } else {
            // Jika data hilang, gunakan placeholder
            totalPaidElement.textContent = 'Rp XXX.XXX (Data hilang)';
        }

        // Generate ID Transaksi baru setiap kali dimuat
        const generateTrxId = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const random = Math.floor(100000 + Math.random() * 900000);
            return `TRX-FG-${year}${month}${day}-${random}`;
        };
        trxIdElement.textContent = generateTrxId();
    }
}

document.addEventListener('DOMContentLoaded', displaySuccessDetails);

//=================================================//
//           HalamanRieayatPesanan.html            //
//=================================================//

// Data dummy riwayat pesanan (Simulasi)
// Untuk menguji, Anda bisa menambahkan beberapa data
const orderHistory = [
    {
        id: 'INV001',
        type: 'Ready-made',
        name: 'Template Web E-Commerce',
        price: 450000,
        quantity: 1,
        date: '2025-11-20',
        status: 'Selesai',
        is_proposal: false
    },
    {
        id: 'INV002',
        type: 'Custom Proposal',
        name: 'UI/UX Aplikasi Mobile',
        price: 0,
        quantity: 1,
        date: '2025-11-25',
        status: 'Menunggu Review Admin',
        is_proposal: true,
        proposal_details: 'Tema: Dark Mode. Anggaran: 12.000.000'
    },
    {
        id: 'INV003',
        type: 'Ready-made',
        name: 'Logo Minimalis Pack (2x)',
        price: 500000,
        quantity: 1,
        date: '2025-11-26',
            status: 'Pembayaran Diterima',
            is_proposal: false
        },
        {
            id: 'INV004',
            type: 'Custom Proposal',
            name: 'Branding & Identity',
            price: 0,
            quantity: 1,
            date: '2025-11-28',
            status: 'Penawaran Ditolak',
            is_proposal: true,
            proposal_details: 'Anggaran terlalu rendah. Silakan ajukan ulang.'
        },
    ];
    
    // Format mata uang Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };
    
    // Fungsi untuk mendapatkan tag status berdasarkan teks
    function getStatusTag(status) {
        let className = 'status-badge ';
        if (status === 'Selesai') {
            className += 'status-success';
        } else if (status === 'Menunggu Review Admin') {
            className += 'status-pending';
        } else if (status === 'Pembayaran Diterima') {
            className += 'status-progress';
        } else if (status === 'Penawaran Ditolak') {
            className += 'status-danger';
        } else {
            className += 'status-info';
        }
        return `<span class="${className}">${status}</span>`;
    }
    
    // Fungsi untuk menampilkan riwayat pesanan
    function displayOrderHistory() {
        const body = document.getElementById('orderHistoryBody');
        body.innerHTML = '';
        
        orderHistory.forEach(order => {
            const row = body.insertRow();
            
            // Kolom 1: ID
            row.insertCell().textContent = order.id;
            
            // Kolom 2: Tipe
            row.insertCell().textContent = order.type;
            
            // Kolom 3: Nama Layanan
            row.insertCell().textContent = order.name;
            
            // Kolom 4: Total Harga
            const priceCell = row.insertCell();
            if (order.price > 0) {
                priceCell.textContent = formatRupiah(order.price * order.quantity);
            } else {
                priceCell.innerHTML = '<span class="text-muted">N/A (Proposal)</span>';
            }
            
            // Kolom 5: Tanggal
            row.insertCell().textContent = order.date;
            
            // Kolom 6: Status
            row.insertCell().innerHTML = getStatusTag(order.status);
            
            // Kolom 7: Aksi
            const actionCell = row.insertCell();
            if (order.is_proposal) {
                // Untuk Proposal
                if (order.status === 'Menunggu Review Admin') {
                    actionCell.innerHTML = `<button class="btn-sm btn-info" onclick="viewDetails('${order.id}', '${order.proposal_details}')"><i class="fas fa-eye"></i> Detail</button>`;
                } else if (order.status === 'Penawaran Ditolak') {
                    actionCell.innerHTML = `<button class="btn-sm btn-danger" onclick="viewDetails('${order.id}', '${order.proposal_details}')"><i class="fas fa-exclamation-triangle"></i> Review</button>`;
                } else {
                    actionCell.innerHTML = `<button class="btn-sm btn-primary" onclick="viewDetails('${order.id}', '${order.proposal_details}')"><i class="fas fa-download"></i> Final Project</button>`;
                }
            } else {
                // Untuk Ready-made
                actionCell.innerHTML = `<button class="btn-sm btn-primary" onclick="downloadFile('${order.id}')"><i class="fas fa-download"></i> Unduh</button>`;
            }
        });
    }
    
    // Fungsi Aksi Simulasi
    function viewDetails(orderId, details) {
        alert(`Detail Penawaran Kustom ${orderId}:\n\n${details}`);
    }
    
    function downloadFile(orderId) {
        alert(`Simulasi: File untuk pesanan ${orderId} sedang dipersiapkan dan diunduh.`);
    }
    
    // ================== FUNGSI CHAT ADMIN (Dari halaman Katalog) ==================
    // Salin dan tambahkan semua fungsi chat di sini (showChatModal, closeChatModal, sendMessage, handleChatEnter)
    
    function showChatModal() {
        document.getElementById('chatModal').style.display = 'block';
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function closeChatModal() {
        document.getElementById('chatModal').style.display = 'none';
    }
    
    function sendMessage() {
        const input = document.getElementById('chatInput');
        const messageText = input.value.trim();
        
        if (messageText === "") {
            return;
        }
        
        const messagesContainer = document.getElementById('chatMessages');
        const now = new Date();
        const timestamp = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        
        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('message', 'user-message');
        userMessageDiv.innerHTML = `${messageText}<span class="timestamp">${timestamp}</span>`;
        messagesContainer.appendChild(userMessageDiv);
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        input.value = '';
        
        setTimeout(() => {
            const adminResponse = `Baik, Admin telah menerima pesan Anda: "${messageText}". Kami akan segera memprosesnya.`;
            const replyTime = new Date();
            const replyTimestamp = replyTime.getHours().toString().padStart(2, '0') + ':' + replyTime.getMinutes().toString().padStart(2, '0');
            
            const adminMessageDiv = document.createElement('div');
            adminMessageDiv.classList.add('message', 'admin-message');
            adminMessageDiv.innerHTML = `${adminResponse}<span class="timestamp">${replyTimestamp}</span>`;
            messagesContainer.appendChild(adminMessageDiv);
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }
    
    function handleChatEnter(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }
    // ==============================================================================
    
    // Panggil fungsi display saat halaman dimuat
    document.addEventListener('DOMContentLoaded', displayOrderHistory);
    
    // ... [Kode Skrip yang sudah ada] ...
    
    // Fungsi untuk membuat template nota HTML
    function generateInvoiceHtml(order) {
    const totalHarga = formatRupiah(order.price * order.quantity);

    return `
    <div class="nota-header">
    <img src="Gambar/Logo2.png" alt="Figmentia Logo" style="width: 50px; margin-bottom: 10px;">
    <h2>NOTA PEMBAYARAN - ${order.id}</h2>
    </div>
    
    <div class="nota-info">
    <div>
    <strong>INFORMASI PELANGGAN</strong>
    Nama: Fahmi Riquelmi (Simulasi)<br>
    Email: user@example.com (Simulasi)<br>
    Tanggal Pesan: ${order.date}
    </div>
    <div>
    <strong>INFORMASI PERUSAHAAN</strong>
    Jl. Digital No. 123<br>
    info@figmentia.com<br>
    </div>
    </div>
    
    <div class="nota-items">
    <table>
    <thead>
    <tr>
    <th>Nama Layanan</th>
    <th>Tipe</th>
    <th>Harga Satuan</th>
    <th>Jumlah</th>
    <th>Subtotal</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td>${order.name}</td>
    <td>${order.type}</td>
    <td>${formatRupiah(order.price)}</td>
    <td>${order.quantity}</td>
    <td>${totalHarga}</td>
    </tr>
                </tbody>
            </table>
            </div>
            
            <div style="text-align: right;">
            <p><strong>TOTAL HARGA: ${totalHarga}</strong></p>
            <span class="status-badge status-success" style="padding: 5px 10px; border-radius: 4px;">LUNAS</span>
            <p style="margin-top: 20px;">Hormat Kami,<br>Figmentia</p>
        </div>
    `;
}

// Fungsi untuk menampilkan modal nota
function showInvoiceModal(orderId) {
    const order = orderHistory.find(o => o.id === orderId);
    if (!order) {
        alert("Data pesanan tidak ditemukan.");
        return;
    }
    
    document.getElementById('invoiceTemplate').innerHTML = generateInvoiceHtml(order);
    document.getElementById('invoiceModal').style.display = 'block';
}

// Fungsi untuk menutup modal nota
function closeInvoiceModal() {
    document.getElementById('invoiceModal').style.display = 'none';
}

// Fungsi utama untuk mengunduh PDF
function downloadInvoice(orderId) {
    if (!window.jspdf) {
        alert("Library PDF tidak tersedia. Pastikan halaman ini memuat jsPDF.");
        return;
    }

    const { jsPDF } = window.jspdf; // Import jsPDF dari window.jspdf

    const input = document.getElementById('invoiceTemplate');
    const filename = `Nota_Pembayaran_${orderId}.pdf`;

    // Sembunyikan tombol aksi saat membuat gambar (agar tidak ikut di PDF)
    const actions = document.querySelector('.invoice-actions');
    actions.style.display = 'none';

    html2canvas(input, { scale: 3 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);

        // Tampilkan kembali tombol aksi
        actions.style.display = 'block';

        // Tutup modal setelah mengunduh
        closeInvoiceModal();
    }).catch(error => {
         console.error("Error saat membuat PDF:", error);
         alert("Gagal membuat file PDF.");
         actions.style.display = 'block'; // Pastikan tombol kembali ditampilkan jika ada error
    });
}


// MODIFIKASI FUNGSI downloadFile() yang sudah ada
// Sekarang akan memanggil showInvoiceModal untuk menampilkan nota sebelum diunduh
function downloadFile(orderId) {
    // Cek apakah order adalah ready-made (yang tombolnya bertuliskan "Unduh")
    const order = orderHistory.find(o => o.id === orderId);
    if (order && !order.is_proposal) {
        // Tampilkan modal nota (di dalamnya ada tombol untuk memicu downloadInvoice)
        showInvoiceModal(orderId);
    } else {
        // Untuk Proposal atau aksi unduh file final project lainnya (Aksi Unduh Lama)
        alert(`Simulasi: File untuk pesanan ${orderId} sedang dipersiapkan dan diunduh.`);
    }
}
    //=================================================//
    //           HalamanRieayatPesanan.html            //
    //=================================================//
    
    // Data dummy untuk simulasi percakapan dengan berbagai admin
    const conversations = [
        {
            id: 'design',
            name: 'Admin Desain (Devi)',
            status: 'Online - Khusus Proyek Desain',
            messages: [
                { type: 'admin', text: 'Halo, saya Devi dari tim Desain. Ada revisi atau pertanyaan terkait progress proyek Anda?', time: '12:30 PM' },
                { type: 'customer', text: 'Halo Devi. Saya mau revisi sedikit di bagian footer website saya. Bisakah itu ditambahkan?', time: '12:32 PM' },
                { type: 'admin', text: 'Bisa, mohon kirimkan detail revisinya di sini. Kami akan segera memproses.', time: '12:33 PM' }
            ]
        },
        {
            id: 'transaction',
            name: 'Admin Transaksi (Rizky)',
            status: 'Online - Khusus Pembayaran & Invoice',
            messages: [
                { type: 'customer', text: 'Halo Rizky. Pembayaran invoice INV003 saya sudah masuk atau belum ya?', time: '10:15 AM' },
                { type: 'admin', text: 'Selamat pagi. Kami cek, pembayaran INV003 sebesar Rp 500.000 sudah kami terima. Terima kasih!', time: '10:18 AM' },
                { type: 'customer', text: 'Oke, terima kasih infonya.', time: '10:20 AM' }
            ]
        },
        {
            id: 'support',
            name: 'Admin General Support',
            status: 'Offline - Hubungi Admin Desain/Transaksi',
            messages: [
                { type: 'admin', text: 'Kami tutup sementara untuk General Support. Silakan hubungi Admin Desain atau Admin Transaksi sesuai kebutuhan Anda.', time: '09:00 AM' }
            ]
        }
    ];
    
    let currentConversationId = null;
    
    // --- FUNGSI UTAMA ---
    
    function loadConversations() {
        const listContainer = document.getElementById('conversationList');
        listContainer.innerHTML = '';
        conversations.forEach(conv => {
            const item = document.createElement('div');
            item.classList.add('item');
            if (conv.id === currentConversationId) {
                item.classList.add('active');
            }
            item.setAttribute('data-id', conv.id);
            item.innerHTML = `
            <h5>${conv.name}</h5>
            <p>${conv.status}</p>
            `;
            item.onclick = () => selectConversation(conv.id);
            listContainer.appendChild(item);
        });
        
        // Pilih percakapan pertama secara default saat load
        if (!currentConversationId && conversations.length > 0) {
            selectConversation(conversations[0].id);
        }
    }
    
    function selectConversation(id) {
        currentConversationId = id;
        loadConversations(); // Reload list untuk menandai yang aktif
        
        const conv = conversations.find(c => c.id === id);
        if (!conv) return;
        
        const messagesContainer = document.getElementById('chatMessages');
        const chatHeader = document.getElementById('chatHeader');
        const chatInput = document.getElementById('customerChatInput');
        const sendButton = document.querySelector('.chat-input-area button');
        
        chatHeader.textContent = `Percakapan dengan ${conv.name}`;
        messagesContainer.innerHTML = ''; // Kosongkan pesan
        
        // Atur status input berdasarkan status admin
        const isActive = conv.status.includes('Online');
        chatInput.disabled = !isActive;
        sendButton.disabled = !isActive;
        chatInput.placeholder = isActive ? "Ketik pesan Anda di sini..." : "Admin sedang Offline atau tidak tersedia.";
        
        
        // Muat pesan-pesan lama
        conv.messages.forEach(msg => {
            appendMessage(msg.type, msg.text, msg.time);
        });
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    
    // Fungsi untuk menambah pesan ke layar
    function appendMessage(type, text, time) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-bubble');
        
        if (type === 'customer') {
            messageDiv.classList.add('customer-reply');
        } else if (type === 'admin') {
            messageDiv.classList.add('admin-message');
        }
        
        messageDiv.innerHTML = `${text}<span class="chat-timestamp">${time}</span>`;
        messagesContainer.appendChild(messageDiv);
    }
    
    // --- FUNGSI CHAT ---
    
    function sendMessage() {
        const inputArea = document.getElementById('customerChatInput');
        const messageText = inputArea.value.trim();
        
        if (messageText === "" || inputArea.disabled) return;
        
        const messagesContainer = document.getElementById('chatMessages');
        const now = new Date();
        const timestamp = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        // 1. Tampilkan pesan Customer
        appendMessage('customer', messageText, timestamp);
        
        // Simpan pesan ke data simulasi
        const conv = conversations.find(c => c.id === currentConversationId);
        if (conv) {
            conv.messages.push({ type: 'customer', text: messageText, time: timestamp });
        }
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        inputArea.value = '';
        inputArea.focus();
        
        // 2. SIMULASI BALASAN ADMIN (setelah 2 detik)
        setTimeout(() => {
            const adminReply = `[${conv.name}]: Kami telah menerima pesan Anda: "${messageText}". Mohon tunggu balasan aktual.`;
            const replyTime = new Date();
            const replyTimestamp = replyTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            
            appendMessage('admin', adminReply, replyTimestamp);
            
            // Simpan balasan ke data simulasi
            if (conv) {
                conv.messages.push({ type: 'admin', text: adminReply, time: replyTimestamp });
            }
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 2000);
    }
    
    // Menangani tombol Enter
    const chatInput = document.getElementById('customerChatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    document.addEventListener('DOMContentLoaded', loadConversations);
    //=================================================//
    //           HalamanRieayatPesanan.html            //
    //=================================================//
    
    // Data dummy simulasi pesanan yang sudah selesai (ready for feedback)
    const completedOrders = [
        { id: 'INV001', name: 'Template Web E-Commerce', date: '2025-11-20' },
        { id: 'INV003', name: 'Logo Minimalis Pack', date: '2025-11-26' },
        { id: 'INV005', name: 'UI/UX Aplikasi Mobile (Kustom)', date: '2025-12-01' },
    ];
    
    // --- FUNGSI RATING BINTANG ---
    let currentRating = 0;
    const ratingLabelMap = {
        1: "Sangat Buruk (1 Bintang)",
        2: "Buruk (2 Bintang)",
        3: "Cukup Baik (3 Bintang)",
        4: "Baik Sekali (4 Bintang)",
        5: "Sempurna (5 Bintang)"
    };
    
    function renderStars() {
        const starContainer = document.getElementById('ratingStars');
        starContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.classList.add('fas', 'fa-star');
            star.setAttribute('data-rating', i);
            if (i <= currentRating) {
                star.classList.add('rated');
            }
            star.addEventListener('mouseover', highlightStars);
            star.addEventListener('mouseout', resetStars);
            star.addEventListener('click', setRating);
            starContainer.appendChild(star);
        }
        updateRatingLabel(currentRating);
    }
    
    function highlightStars(event) {
        const rating = parseInt(event.target.dataset.rating);
        document.querySelectorAll('.rating-stars .fa-star').forEach(star => {
            if (parseInt(star.dataset.rating) <= rating) {
                star.classList.add('rated');
            } else {
                star.classList.remove('rated');
            }
        });
        updateRatingLabel(rating);
    }
    
    function resetStars() {
        document.querySelectorAll('.rating-stars .fa-star').forEach(star => {
            if (parseInt(star.dataset.rating) > currentRating) {
                star.classList.remove('rated');
            }
        });
        updateRatingLabel(currentRating);
    }
    
    function setRating(event) {
        currentRating = parseInt(event.target.dataset.rating);
        document.getElementById('ratingValue').value = currentRating;
        renderStars(); // Render ulang untuk mengunci status rated
    }
    
    function updateRatingLabel(rating) {
        const label = document.getElementById('ratingLabel');
        if (rating === 0) {
            label.textContent = "Pilih rating Anda (0 Bintang)";
        } else {
            label.textContent = ratingLabelMap[rating];
        }
    }
    
    
    // --- FUNGSI FORM ---
    
    function populateOrderSelect() {
        const select = document.getElementById('orderId');
        completedOrders.forEach(order => {
            const option = document.createElement('option');
            option.value = order.id;
            option.textContent = `${order.id} - ${order.name} (Selesai ${order.date})`;
            select.appendChild(option);
        });
    }
    
    function submitFeedback(event) {
        event.preventDefault();
        
        const form = document.getElementById('feedbackForm');
        const orderId = form.orderId.value;
        const rating = parseInt(form.ratingValue.value);
        const feedbackText = form.feedbackText.value;
        
        if (rating === 0) {
            alert("Mohon berikan rating bintang minimal 1 sebelum mengirimkan umpan balik.");
            return;
        }
        
        const selectedOrder = completedOrders.find(o => o.id === orderId);
        
        const confirmationMessage = 
        `Anda yakin ingin mengirimkan umpan balik ini?\n\n` +
        `Pesanan: ${selectedOrder.name}\n` +
        `Rating: ${rating} Bintang (${ratingLabelMap[rating]})\n` +
        `Komentar: "${feedbackText.substring(0, 50)}..."`;
        
        if (confirm(confirmationMessage)) {
            // Logika pengiriman data simulasi
            console.log("DATA UMPAN BALIK DIKIRIM:", {
                orderId: orderId,
                orderName: selectedOrder.name,
                rating: rating,
                feedbackText: feedbackText,
                timestamp: new Date().toISOString()
            });
            
            alert(`✅ Terima kasih! Umpan balik untuk pesanan ${orderId} (${rating} Bintang) berhasil dikirimkan.`);
            
            // Reset form setelah sukses
            form.reset();
            currentRating = 0;
            renderStars();
        }
    }
    
    // Panggil fungsi inisialisasi saat DOM selesai dimuat
    document.addEventListener('DOMContentLoaded', () => {
        populateOrderSelect();
        renderStars();
    });
    
    //=================================================//
    //                 HalamanProfil.html              //
    //=================================================//

    // --- FUNGSI TAB NAVIGASI ---
    function openTab(evt, tabName) {
        // Hapus class 'active' dari semua tab-pane
        const tabContent = document.querySelectorAll('.tab-pane');
        tabContent.forEach(pane => {
            pane.classList.remove('active');
        });

        // Hapus class 'active' dari semua tombol tab
        const tabLinks = document.querySelectorAll('.tab-nav button');
        tabLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Tampilkan tab yang dipilih
        document.getElementById(tabName).classList.add('active');
        // Tandai tombol yang diklik sebagai 'active'
        evt.currentTarget.classList.add('active');
    }

    // --- FUNGSI SIMPAN PROFIL (Simulasi) ---
    function saveProfile(event) {
        event.preventDefault();
        const nama = document.getElementById('nama').value;
        const phone = document.getElementById('phone').value;
        
        alert(`✅ Data profil berhasil disimpan!\nNama: ${nama}\nTelepon: ${phone}`);
    }

    // --- FUNGSI UBAH KATA SANDI (Simulasi) ---
    function changePassword(event) {
        event.preventDefault();
        const oldPass = document.getElementById('oldPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmNewPassword').value;

        if (newPass.length < 6) {
            alert("Kata sandi baru minimal harus 6 karakter.");
            return;
        }
        
        if (newPass !== confirmPass) {
            alert("Konfirmasi kata sandi baru tidak cocok.");
            return;
        }
        
        // Simulasi validasi kata sandi lama
        // Dalam aplikasi nyata, ini akan divalidasi di server
        if (oldPass.length > 0) { 
             alert("✅ Kata sandi berhasil diubah! Anda akan dialihkan ke halaman login. (Simulasi)");
             document.getElementById('securityForm').reset();
        } else {
             alert("❌ Kata sandi lama salah atau kosong. Mohon coba lagi.");
        }
    }


