async function audio_quron() {
    let inputElement = document.getElementById("inputElement").value;
    if (!inputElement) return;

    try {
      
        let audioRes = await fetch(`https://api.quran.com/api/v4/chapter_recitations/1/${inputElement}`);

         let audioData = await audioRes.json();




        let arabicRes = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${inputElement}`);
        let arabicData = await arabicRes.json();





        let uzbekRes = await fetch(`https://api.quran.com/api/v4/quran/translations/131?chapter_number=${inputElement}`);
        let uzbekData = await uzbekRes.json();

      



        if (!audioData.audio_file || !arabicData.verses || !uzbekData.translations) {
            document.getElementById("textWrapper").innerHTML = "<p>Ma'lumot topilmadi.</p>";
            return;
        }

      
        let audioWrapper = document.querySelector("#audioWrapper");
        audioWrapper.innerHTML = "";


        let audio = document.createElement("audio");
        
        
        audio.src = audioData.audio_file.audio_url;
        audio.controls = true;
        
        
        audio.autoplay = true;
        audioWrapper.append(audio);

      
        let textWrapper = document.querySelector("#textWrapper");
        textWrapper.innerHTML = "";
        let index = 0;

        audio.addEventListener("timeupdate", () => {
        
        
            if (index >= arabicData.verses.length) return;

        
            let arabic = arabicData.verses[index].text_uthmani;
            let uzbek = uzbekData.translations[index] ? uzbekData.translations[index].text : "O‘zbekcha tarjima yo‘q";

            let p = document.createElement("p");
        
        
        
        
            p.innerHTML = `<strong>${arabic}</strong> <br> ${uzbek}`;
        
            textWrapper.appendChild(p);
            index++;
        });


    } catch (error) {
        
        console.error("Xato", error);
    }
}


document.querySelector("#readAll").addEventListener("click", audio_quron);
