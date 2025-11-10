async function audio_quron() {
    const suraNumber = document.getElementById("inputElement").value.trim();
    if (!suraNumber) {
      alert("Iltimos, sura raqamini kiriting!");
      return;
    }
  
    try {
      // 1. Sura ma'lumotlari (nomi va tarjima)
      const suraRes = await fetch(`https://api.quran.com/api/v4/chapters/${suraNumber}`);
      const suraData = await suraRes.json();
  
      // Sura nomini chiqarish
      const header = document.querySelector("header h1");
      if (suraData.chapter) {
        header.textContent = `📖 ${suraData.chapter.name_arabic} — ${suraData.chapter.name_simple}`;
      }
  
      // 2. Audio va oyatlar
      const [audioRes, arabicRes, uzbekRes] = await Promise.all([
        fetch(`https://api.quran.com/api/v4/chapter_recitations/1/${suraNumber}`),
        fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${suraNumber}`),
        fetch(`https://api.quran.com/api/v4/quran/translations/131?chapter_number=${suraNumber}`)
      ]);
  
      const audioData = await audioRes.json();
      const arabicData = await arabicRes.json();
      const uzbekData = await uzbekRes.json();

      console.log("audioData",audioData);
      console.log("arabicData",arabicData);
        console.log("uzbekData",uzbekData);
      
  
      // Audio pleer
      const audioWrapper = document.getElementById("audioWrapper");
      audioWrapper.innerHTML = "";
      if (!audioData.audio_file) {
        audioWrapper.innerHTML = "<p>Audio topilmadi.</p>";
        return;
      }
  
      const audio = document.createElement("audio");
      audio.src = audioData.audio_file.audio_url;
      audio.controls = true;
      audioWrapper.append(audio);
  
      // Oyatlar va tarjimalar
      const textWrapper = document.getElementById("textWrapper");
      textWrapper.innerHTML = "";
  
      arabicData.verses.forEach((verse, i) => {
        const uzbek = uzbekData.translations[i] ? uzbekData.translations[i].text : "O‘zbekcha tarjima yo‘q";
        const p = document.createElement("p");
        p.innerHTML = `<strong>${verse.text_uthmani}</strong><br>${uzbek}`;
        textWrapper.appendChild(p);
      });
  
    } catch (err) {
      console.error(err);
      document.getElementById("textWrapper").innerHTML = "<p>Xatolik yuz berdi. Qayta urinib ko‘ring.</p>";
    }
  }
  
  document.getElementById("readAll").addEventListener("click", audio_quron);
  
  const inputElement = document.getElementById("inputElement");

inputElement.addEventListener("change", () => {
    audio_quron();
});
inputElement.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        audio_quron();
    }
});