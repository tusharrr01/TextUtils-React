import React, { useState } from 'react';
import QRCode from 'react-qr-code';

export default function TextForm(props) {
    const [text, setText] = useState('');
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');


    const handleUpClick = () => {
        let newText = text.toUpperCase();
        setText(newText);
        props.showAlert("Converted to uppercase!", "success");
    };

    const handleLoClick = () => { 
        let newText = text.toLowerCase();
        setText(newText);
        props.showAlert("Converted to lowercase!", "success");
    };

    const handleTitleCase = () => {
        let newText = text.split(" ").map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(" ");
        setText(newText);
        props.showAlert("Converted to Title Case!", "success");
    };

    const handleSentenceCase = () => {
        let newText = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        setText(newText);
        props.showAlert("Converted to Sentence Case!", "success");
    };

    const handleClearClick = () => { 
        setText('');
        props.showAlert("Text Cleared!", "success");
    };

    const handleReverse = () => {
        setText(text.split('').reverse().join(''));
        props.showAlert("Text Reversed!", "success");
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text); 
        props.showAlert("Copied to Clipboard!", "success");
    };

    const handleExtraSpaces = () => {
        setText(text.split(/[ ]+/).join(" "));
        props.showAlert("Extra spaces removed!", "success");
    };

    const handleReplace = () => {
        setText(text.replace(new RegExp(findText, 'g'), replaceText));
        props.showAlert("Text Replaced!", "success");
    };

    // const handleEncrypt = () => {
    //     setText(text.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 5).join('')));
    //     props.showAlert("Text Encrypted!", "success");
    // };

    // const handleDecrypt = () => {
    //     setText(text.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 5).join('')));
    //     props.showAlert("Text Decrypted!", "success");
    // };

    const handleSpeak = () => {
        const msg = new SpeechSynthesisUtterance();
        msg.text = text;
        window.speechSynthesis.speak(msg);
        props.showAlert("Reading text aloud!", "success");
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "myText.txt";
        document.body.appendChild(element);
        element.click();
        props.showAlert("Downloaded as file!", "success");
    };

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setText(password);
        props.showAlert("Password Generated!", "success");
    };

    const getWordFrequency = () => {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const frequency = {};
        words.forEach(word => frequency[word] = (frequency[word] || 0) + 1);
        return Object.entries(frequency).sort((a, b) => b[1] - a[1]);
    };

    const getTextStats = () => {
        return {
            sentences: text.split(/[.!?]+/).filter(Boolean).length,
            paragraphs: text.split(/\n\s*\n/).filter(Boolean).length,
            lines: text.split(/\n/).filter(Boolean).length,
            vowels: (text.match(/[aeiouAEIOU]/g) || []).length,
            consonants: (text.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length
        };
    };

    const summarizeText = () => {
        const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
        if (sentences.length > 0) {
            setText(sentences.slice(0, Math.ceil(sentences.length / 3)).join(' '));
            props.showAlert("Text Summarized!", "success");
        }
    };

    const formatJSON = () => {
        try {
            setText(JSON.stringify(JSON.parse(text), null, 2));
            props.showAlert("JSON Formatted!", "success");
        } catch (e) {
            props.showAlert("Invalid JSON!", "danger");
        }
    };

    const wordCount = text.split(/\s+/).filter(element => element.length !== 0).length;
    const charCount = text.length;
    const readingTime = 0.008 * wordCount;
    const stats = getTextStats();
    const wordFreq = getWordFrequency();

    return(
        <>
            <div className="container" style={{color: props.mode === 'dark' ? 'white' : '#042743'}}>
                <h1 className='mb-4'>{props.heading}</h1>
                <div className="mb-3">
                    <textarea 
                        className="form-control" 
                        value={text} 
                        onChange={(e) => setText(e.target.value)}
                        style={{
                            backgroundColor: props.mode === 'dark' ? '#13466e' : 'white',
                            color: props.mode === 'dark' ? 'white' : '#042743'
                        }}
                        id="myBox" 
                        rows="8"
                    > </textarea>
                </div>
                <div className="btn-group mb-3" role="group">
                    <button disabled={!text} className="btn btn-primary mx-1 my-1" onClick={handleUpClick}>UPPERCASE</button>
                    <button disabled={!text} className="btn btn-primary mx-1 my-1" onClick={handleLoClick}>lowercase</button>
                    <button disabled={!text} className="btn btn-primary mx-1 my-1" onClick={handleTitleCase}>Title Case</button>
                    <button disabled={!text} className="btn btn-primary mx-1 my-1" onClick={handleSentenceCase}>Sentence case</button>
                </div>
                <div className="btn-group mb-3" role="group">
                    <button disabled={!text} className="btn btn-success mx-1 my-1" onClick={handleCopy}>Copy Text</button>
                    <button disabled={!text} className="btn btn-success mx-1 my-1" onClick={handleExtraSpaces}>Remove Extra Spaces</button>
                    <button disabled={!text} className="btn btn-success mx-1 my-1" onClick={handleReverse}>Reverse Text</button>
                    <button disabled={!text} className="btn btn-danger mx-1 my-1" onClick={handleClearClick}>Clear Text</button>
                </div>
                <div className="btn-group mb-3" role="group">
                    {/* <button disabled={!text} className="btn btn-warning mx-1 my-1" onClick={handleEncrypt}>Encrypt</button>
                    <button disabled={!text} className="btn btn-warning mx-1 my-1" onClick={handleDecrypt}>Decrypt</button> */}
                    <button disabled={!text} className="btn btn-warning mx-1 my-1" onClick={handleSpeak}>Speak</button>
                    <button disabled={!text} className="btn btn-warning mx-1 my-1" onClick={handleDownload}>Download</button>
                    <button className="btn btn-warning mx-1 my-1" onClick={generatePassword}>Generate Password</button>
                    <button disabled={!text} className="btn btn-warning mx-1 my-1" onClick={summarizeText}>Summarize</button>
                    <button disabled={!text} className="btn btn-warning mx-1 my-1" onClick={formatJSON}>Format JSON</button>
                </div>
                <div className="row mb-3">
                    <div className="col-md-5">
                        <input type="text" className="form-control" placeholder="Find..." value={findText} onChange={(e) => setFindText(e.target.value)} />
                    </div>
                    <div className="col-md-5">
                        <input type="text" className="form-control" placeholder="Replace with..." value={replaceText} onChange={(e) => setReplaceText(e.target.value)} />
                    </div>
                    <div className="col-md-2">
                        <button disabled={!text || !findText} className="btn btn-info w-100" onClick={handleReplace}>Replace</button>
                    </div>
                </div>
                <div className="row">
                    <div className="container my-2 col-md-3" style={{color: props.mode === 'dark' ? 'white' : '#042743'}}>
                        <h2>Text Statistics</h2>
                        <p><strong>Words:</strong> {wordCount} | <strong>Characters:</strong> {charCount}</p>
                        <p><strong>Sentences:</strong> {stats.sentences} | <strong>Paragraphs:</strong> {stats.paragraphs}</p>
                        <p><strong>Vowels:</strong> {stats.vowels} | <strong>Consonants:</strong> {stats.consonants}</p>
                        <p><strong>Reading Time:</strong> {readingTime.toFixed(2)} minutes</p>
                        <div>
                            {wordFreq.length > 0 && (
                                <div className="mt-3">
                                    <h4>Word Frequency</h4>
                                    <div className="d-flex flex-wrap">
                                        {wordFreq.slice(0, 10).map(([word, count]) => (
                                            <span key={word} className="badge bg-secondary m-1">{word}: {count}</span> 
                                        ))}
                                    </div> 
                                </div>
                            )}
                        </div>   
                    </div>
                    <div className="col-md-3">
                        {text && (
                        <div className="text-center my-3">
                            <h3>QR Code</h3>
                            <div style={{background: props.mode === 'dark' ? '#13466e' : 'white',padding: '10px',display: 'inline-block'}}>
                            <QRCode 
                                value={text}
                                size={190}
                                bgColor={props.mode === 'dark' ? '#13466e' : 'white'}
                                fgColor={props.mode === 'dark' ? 'white' : 'black'}
                            />
                            </div>
                        </div>
                        )}
                    </div>
                    <div className="col-md-6" style={{color: props.mode === 'dark' ? 'white' : '#042743'}} >
                        <div className="container my-3" >
                            <h2>Text Preview</h2>
                            <p style={{maxWidth:'600px'}} >{text || "Nothing to preview!"}</p>
                        </div>
                    </div>
                </div>  
            </div>
        </>
    );
}