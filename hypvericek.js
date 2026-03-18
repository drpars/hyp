// ==UserScript==
// @name         HYP Otomatik Sekme ve Veri Çekici
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  HYP dashboard verilerini otomatik sekmeye geçerek kopyalar.
// @author       drpars
// @match        https://hyp.saglik.gov.tr/dashboard*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hash === "#kopyala") {
        const checkTabExist = setInterval(function() {
            const targetTab = document.querySelector('a[id="5"]');
            if (targetTab) {
                targetTab.click();
                clearInterval(checkTabExist);

                // Sayfada ilk tıklamayı bekleyen mekanizmayı kur
                setupAutoCopyOnclick();
            }
        }, 500);
    }

    function setupAutoCopyOnclick() {
        // Kullanıcı sayfada herhangi bir yere tıkladığı an çalışacak
        const copyHandler = async () => {
            const cardElements = document.querySelectorAll('.population-target-analysis .content-sub');
            let dataLines = [];

            cardElements.forEach(card => {
                const title = card.querySelector('.title')?.textContent.trim() || "Başlıksız";
                const value = card.querySelector('.performance-statistics-value')?.textContent.trim() || "0";
                dataLines.push(`${title}\t${value}`);
            });

            if (dataLines.length > 0) {
                const finalResult = dataLines.join("\n");
                try {
                    await navigator.clipboard.writeText(finalResult);
                    alert("✅ BAŞARILI!\n" + dataLines.length + " satır veri kopyalandı.");
                    // Bir kez çalıştıktan sonra dinleyiciyi kaldır
                    document.removeEventListener('click', copyHandler);
                } catch (err) {
                    console.log("Kopyalama hala engelleniyor.");
                }
            }
        };

        // Sayfa geneline tıklama dinleyicisi ekle
        document.addEventListener('click', copyHandler);

        // Kullanıcıyı bilgilendirmek için küçük bir not (Opsiyonel)
        console.log("Veriler hazır. Kopyalamak için sayfanın herhangi bir yerine bir kez tıklayın.");
    }
})();
