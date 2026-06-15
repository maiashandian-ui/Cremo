/**
 * Kreativa Studion - JavaScript för effektmätning och konverteringsstöd
 * Denna fil hjälper till att simulera formulärinsamling och hantera UTM-parametrar
 */

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Funktion för att läsa UTM-parametrar från URL ---
    function getUTMParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            source: urlParams.get('utm_source') || '',
            medium: urlParams.get('utm_medium') || '',
            campaign: urlParams.get('utm_campaign') || ''
        };
    }

    // --- 2. Automatiskt fyll i gömda spårningsfält om de finns i formulär ---
    const utm = getUTMParams();
    
    // Exempel för produkt-1 formulär
    const p1_source = document.getElementById('p1_utm_source');
    const p1_medium = document.getElementById('p1_utm_medium');
    const p1_campaign = document.getElementById('p1_utm_campaign');
    
    if(p1_source && utm.source) p1_source.value = utm.source;
    if(p1_medium && utm.medium) p1_medium.value = utm.medium;
    if(p1_campaign && utm.campaign) p1_campaign.value = utm.campaign;

    // --- 3. Formulär-interaktionslogg (Hjälpsamt för att förstå fyllnadsgrad/funnels) ---
    const allForms = document.querySelectorAll('form');
    allForms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                console.log(`[Analys-Info] Användaren började fylla i fältet: ${input.name} i formulär: ${form.id}`);
                // Här kan man framöver lägga till GTM dataLayer.push-händelser
            }, { once: true }); // Triggers bara en gång per fält
        });
        
        // Interceptera inskick för att simulera analysfördröjning / validering
        form.addEventListener('submit', function(e) {
            console.log(`[Analys-Event] Formulär skickat: ${form.id}`);
            // Om man vill skicka med UTM vidare till thank-you.html i utbildningssyfte:
            if(utm.source || utm.medium || utm.campaign) {
                // Skapa en förlängd action-URL med bibehållna UTM taggar för att spåra fullständig funnel
                e.preventDefault();
                let targetUrl = form.getAttribute('action') || 'thank-you.html';
                let currentActionParams = new URLSearchParams();
                if(utm.source) currentActionParams.set('utm_source', utm.source);
                if(utm.medium) currentActionParams.set('utm_medium', utm.medium);
                if(utm.campaign) currentActionParams.set('utm_campaign', utm.campaign);
                
                window.location.href = targetUrl + '?' + currentActionParams.toString();
            }
        });
    });

    // --- 4. Klickspårning på viktiga CTA (Call To Action) Knappar ---
    const ctaButtons = document.querySelectorAll('.btn, .main-nav a');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonId = button.getAttribute('id') || 'Inget ID';
            const buttonText = button.innerText.trim();
            const destination = button.getAttribute('href');
            
            console.log(`[CTA-Klick] ID: ${buttonId}, Text: "${buttonText}", Destination: ${destination}`);
            // Utmärkt ställe för studenten att lägga in GA4 custom event spårning
        });
    });
});
