// ==UserScript==
// @name         SİNA Otomatik Tablo Çekici (Kilitli)
// @match        https://sina.saglik.gov.tr/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // EMNİYET KİLİDİ: Sadece URL sonunda #kopyala varsa çalışır
    if (window.location.hash === "#kopyala") {
        
        console.log("SİNA Otomasyonu Aktif: Kopyalamak için bir kez tıklayın.");

        const copySinaTable = async () => {
            let headers = ["Hastalık/İşlem", "Yapılan"];
            let rows = document.querySelectorAll('tr[role="row"], tbody tr');
            let data = [headers.join("\t")];
            let foundAnyData = false;

            rows.forEach(row => {
                let cells = row.querySelectorAll('td, [role="gridcell"]');
                if (cells.length > 0) {
                    let rowText = Array.from(cells).map(c => c.textContent.trim()).join("\t");
                    if (rowText.replace(/\t/g, "").length > 0) {
                        data.push(rowText);
                        foundAnyData = true;
                    }
                }
            });

            if (foundAnyData) {
                const finalResult = data.join("\n");
                try {
                    await navigator.clipboard.writeText(finalResult);
                    alert("✅ SİNA VERİLERİ KOPYALANDI!\n" + (data.length - 1) + " satır tablo verisi alındı.");
                    // İşlem bittikten sonra dinleyiciyi kaldır
                    document.removeEventListener('click', copySinaTable);
                } catch (err) {
                    alert("Kopyalama başarısız, lütfen sayfaya tekrar tıklayın.");
                }
            }
        };

        // Sayfada herhangi bir yere ilk tıklamayı bekler
        document.addEventListener('click', copySinaTable);
    }
})();
