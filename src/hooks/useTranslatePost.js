
import { useEffect, useState } from 'react'
import translate from 'translate';
// dont use this hook. This need to be updated first
function useTranslatePost(textToBeTranslated) {

    const [translatedtext, setTranslatedText] = useState('');
    const [detectedLanguageCode, setDetectedLanguageCode] = useState(null)
    useEffect(() => {
        (async () => {
            const endpoint = `https://api.dandelion.eu/datatxt/li/v1/?text=${textToBeTranslated}&token=dbfa0d365a2440a6b477878602cbf0b2`
            const res = await fetch(endpoint)
            const langs = await res.json()
            const lang = langs.detectedLangs[0].lang
            setDetectedLanguageCode(lang)
        })()
    }, [textToBeTranslated])

    const translatePost = async () => {
        if (!detectedLanguageCode) return
        if (detectedLanguageCode !== "eng") {
            try {
                const translateText = await translate(textToBeTranslated, {
                    from: detectedLanguageCode,
                    to: "en",
                });
                setTranslatedText(translateText)
                console.log("Translated text:", translateText);
            } catch (error) {
                console.error("Translation failed:", error);
            }
        } else {
            console.log("Text is already in English:", textToBeTranslated);
        }
    };
    return { translatePost, translatedtext, detectedLanguageCode, setDetectedLanguageCode }
}
export { useTranslatePost }