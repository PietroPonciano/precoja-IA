// src/pages/PesquisaPreco.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Cropper from "react-easy-crop";
import { 
  UploadCloud, 
  Search, 
  Maximize, 
  Minimize, 
  Check, 
  ChevronRight, 
  RotateCcw, 
  ScanLine,
  Sparkles,
  Tag,
  ArrowRight,
  ShoppingBag,
  Eraser // <--- Ícone adicionado
} from "lucide-react";
import * as tf from "@tensorflow/tfjs";
import { removeBackground } from "@imgly/background-removal";
import { getCroppedImg } from "./cropImage";

// --- Lógica TensorFlow (Mantida) ---
let model;
let labels = [];

async function loadModel() {
  if (!model) {
    try {
      model = await tf.loadLayersModel("/modelo-tm/model.json");
      const metadata = await fetch("/modelo-tm/metadata.json").then(res => res.json());
      labels = metadata.labels;
    } catch (e) {
      console.error("Erro carregando modelo:", e);
    }
  }
}

async function classifyImage(imageElement) {
  if (!model) await loadModel();
  if (!model) return ""; 

  const tensor = tf.browser.fromPixels(imageElement)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .div(255.0)
    .expandDims();
  const predictions = await model.predict(tensor).data();
  const highestIndex = predictions.indexOf(Math.max(...predictions));
  return labels[highestIndex];
}

// --- Helper para simular Categorias baseadas na label (Mantido) ---
const getCategoryPath = (label) => {
    const map = {
        "celular": "Eletrônicos / Telefonia",
        "tenis": "Moda / Calçados",
        "relogio": "Acessórios / Joias",
        "garrafa": "Utilidades / Esporte",
        "default": "Geral / Diversos"
    };
    return map[label.toLowerCase()] || `Categoria: ${label}`;
};

// --- Componente Stepper (Mantido) ---
const Stepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Upload" },
    { id: 2, label: "Ajuste" },
    { id: 3, label: "IA" },
    { id: 4, label: "Busca" },
  ];

  return (
    <div className="flex items-center justify-center w-full mb-8 px-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex flex-col items-center relative`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 z-10
              ${currentStep >= step.id 
                ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-110" 
                : "bg-slate-800 text-slate-500 border border-slate-700"}`}
            >
              {currentStep > step.id ? <Check size={16} /> : step.id}
            </div>
            <span className={`absolute -bottom-6 text-xs font-medium transition-colors duration-300 ${currentStep >= step.id ? 'text-indigo-300' : 'text-slate-600'}`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`h-1 w-12 md:w-20 mx-2 rounded-full transition-colors duration-500 ${currentStep > step.id ? "bg-indigo-500" : "bg-slate-800"}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default function PesquisaPreco() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); 
  const [scanning, setScanning] = useState(false); 
  // Novo estado para loading da remoção de fundo
  const [removingBg, setRemovingBg] = useState(false); 

  // Imagem
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(0);
  const [displayImage, setDisplayImage] = useState(null); // Imagem atual no cropper/preview
  const [originalImageSrc, setOriginalImageSrc] = useState(null);

  // Dados do Produto
  const [categoriaDetectada, setCategoriaDetectada] = useState("");
  const [modeloUsuario, setModeloUsuario] = useState("");
  
  const [buscandoPreco, setBuscandoPreco] = useState(false);
  const [resultadoPreco, setResultadoPreco] = useState(null);

  const handleReset = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setDisplayImage(null);
    setModeloUsuario("");
    setResultadoPreco(null);
    setStep(1);
    // Resetar estados de loading se necessário
    setRemovingBg(false);
    setScanning(false);
    setAspectRatio(0);
  };

const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // NOVO: Validação de tipo de arquivo
        if (!file.type.startsWith('image/')) {
            alert("Por favor, selecione um arquivo de imagem.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setOriginalImageSrc(reader.result); // Guarda a original
            setDisplayImage(reader.result); // Imagem para o cropper
            setStep(2);
        };
        reader.readAsDataURL(file);
    };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
        if (!displayImage || !croppedAreaPixels) return;
        setLoading(true);
        try {
            const croppedUrl = await getCroppedImg(displayImage, croppedAreaPixels);
            setCroppedImage(croppedUrl);
            setStep(3);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

const handleSkipCrop = () => {
        if (!originalImageSrc) return; // Usa a imagem original como imagem cortada
        setCroppedImage(originalImageSrc);
        setDisplayImage(originalImageSrc);
setStep(3);
    }

const handleRecrop = () => {
        setDisplayImage(croppedImage || originalImageSrc); // Usa a recortada/sem fundo ou a original
        setStep(2);
    }

  // --- Nova Função: Remover Fundo ---
const handleRemoveBackground = async () => {
        if (!croppedImage || removingBg) return;
        setRemovingBg(true);
        
        try {
            const blob = await removeBackground(croppedImage);
            const transparentUrl = URL.createObjectURL(blob);
            
            if (croppedImage.startsWith('blob:')) URL.revokeObjectURL(croppedImage);

            setCroppedImage(transparentUrl); // Atualiza o preview com a imagem sem fundo
        } catch (error) {
            console.error("Erro ao remover fundo:", error);
        } finally {
            setRemovingBg(false);
        }
    };
  // ----------------------------------

  const handleIdentify = async () => {
    if (!croppedImage) return;
    setScanning(true);
    
    setTimeout(async () => {
      const img = new Image();
      img.src = croppedImage;
      // Importante: garantir que CORS permita a leitura se a imagem vier de blob externo
      img.crossOrigin = "anonymous"; 
      img.onload = async () => {
        try {
          const prediction = await classifyImage(img);
          const path = getCategoryPath(prediction);
          setCategoriaDetectada(path);
          setModeloUsuario(""); 
          setScanning(false);
          setStep(4);
        } catch (error) {
          console.error(error);
          setScanning(false);
        }
      };
      img.onerror = (e) => {
          console.error("Erro ao carregar imagem para classificação", e);
          setScanning(false);
      }
    }, 1500);
  };
  
const handleBuscarPreco = () => {
    if (!modeloUsuario) return;

    setBuscandoPreco(true);
    setResultadoPreco(null);

    setTimeout(() => {
        const lojas = ["Amazon", "Mercado Livre", "Kabum", "Magalu", "Submarino"];

        // 1. Simular uma amostra de 5 preços
        const numeroAmostras = 5;
        const precosAmostra = [];
        
        // Loop para gerar 5 preços aleatórios
        for (let i = 0; i < numeroAmostras; i++) {
            const precoAleatorio = Math.random() * 6500 + 1500;
            precosAmostra.push(precoAleatorio);
        }

        // 2. Calcular o Preço Médio REAL
        const somaPrecos = precosAmostra.reduce((acc, preco) => acc + preco, 0);
        const precoMedioBase = somaPrecos / numeroAmostras;
        
        // 3. NOVO: Aplicar um aumento (ex: 10%) para a exibição, fazendo parecer mais caro
        const aumentoPercentual = 1.10; // Aumenta em 10%
        const precoMedioAjustado = precoMedioBase * aumentoPercentual;
        
        // Formatar o Preço Médio AJUSTADO para exibição
        const precoMedioFormatado = precoMedioAjustado.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        // 4. Selecionar o "Preço Principal" (o mais baixo da amostra)
        const menorPreco = Math.min(...precosAmostra);
        const precoPrincipalFormatado = menorPreco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        // 5. Calcular o parcelamento do Preço Principal (o menor)
        const parcela = (menorPreco / 10).toFixed(2);
        const parcelaFormatada = Number(parcela).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        // 6. Atualizar o estado
        setResultadoPreco({
            valor: precoPrincipalFormatado,
            precoMedio: precoMedioFormatado, // Preço Médio AJUSTADO (10% acima da média real)
            loja: lojas[Math.floor(Math.random() * lojas.length)],
            produtoFull: `${categoriaDetectada} - ${modeloUsuario}`,
            parcelamento: `10x de ${parcelaFormatada}`
        });

        setBuscandoPreco(false);
    }, 2000);
};


  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white font-sans selection:bg-indigo-500/30">
      
      {/* Navbar (Mantida) */}
      <nav className="w-full p-6 max-w-7xl mx-auto flex justify-between items-center opacity-80">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Search size={18} className="text-white" />
          </div>
          <span>Preço<span className="text-indigo-400">Já</span></span>
        </Link>
        {step > 1 && (
            <button onClick={handleReset} className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                <RotateCcw size={14} /> Reiniciar
            </button>
        )}
      </nav>

      <main className="flex flex-col items-center justify-center px-4 pb-12 min-h-[80vh]">
        
        <div className="text-center mb-8 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Stepper currentStep={step} />
        </div>

        {/* Card Principal */}
        <div className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative min-h-[450px] flex flex-col transition-all duration-500">
          
          {/* Loading Global (Mantido) */}
          {loading && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* --- STEP 1: UPLOAD (Mantido) --- */}
          {step === 1 && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 text-center animate-in fade-in zoom-in-95 duration-300">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                Busca Visual de Preços
              </h1>
              <p className="text-slate-400 mb-10 max-w-lg text-lg">
                Envie uma foto. Nós detectamos a categoria e você encontra o melhor preço.
              </p>
              
              <label className="group relative flex flex-col items-center justify-center w-full max-w-lg p-10 border-2 border-dashed border-slate-700 rounded-2xl hover:border-indigo-500 hover:bg-indigo-500/5 transition-all cursor-pointer">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <UploadCloud className="w-8 h-8 text-indigo-400" />
                </div>
                <span className="text-lg font-medium text-slate-200">Carregar Imagem</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          )}

          {/* --- STEP 2: CROP --- */}
          
{step === 2 && displayImage && (
            <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
                <div className="relative flex-1 bg-black min-h-[400px]">
                    <Cropper
                        // ALTERADO: Usar displayImage
                        image={displayImage} 
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio > 0 ? aspectRatio : undefined} 
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <div className="p-6 bg-slate-900 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 z-10">
                    
                    {/* Controles de Aspect Ratio (NOVO) */}
                    <div className="flex items-center gap-2 order-2 md:order-1">
                        <span className="text-sm text-slate-400 mr-2 hidden md:inline">Formato:</span>
                        {[
                            { label: "Livre", aspect: 0 },
                            { label: "1:1", aspect: 1 },
                            { label: "4:3", aspect: 4 / 3 },
                            { label: "16:9", aspect: 16 / 9 },
                        ].map(({ label, aspect }) => (
                            <button
                                key={label}
                                onClick={() => setAspectRatio(aspect)}
                                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors 
                                    ${aspectRatio === aspect 
                                        ? "bg-indigo-600 text-white" 
                                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"}`
                                }
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Controles de Zoom e Botões de Ação */}
                    <div className="flex items-center gap-4 flex-1 order-1 md:order-2 w-full md:w-auto">
                        <Minimize size={20} className="text-slate-500" />
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <Maximize size={20} className="text-slate-500" />
                    </div>

                    <div className="flex gap-3 order-3 w-full md:w-auto mt-4 md:mt-0">
                        {/* NOVO BOTÃO: Avançar sem Recortar */}
                        <button
                            onClick={handleSkipCrop}
                            className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-semibold transition flex items-center gap-2 text-sm flex-1 md:flex-none"
                        >
                            Avançar sem Recortar
                        </button>
                        
                        {/* Botão de Recortar Original */}
                        <button
                            onClick={handleCrop}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 flex-1 md:flex-none"
                        >
                            Recortar <ChevronRight size={18} />
                        </button>
                    </div>

                </div>
            </div>
        )}

          {/* --- STEP 3: PREVIEW & IDENTIFY (Modificado) --- */}
          {step === 3 && croppedImage && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
                {/* Container da Imagem de Preview (Mantido) */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-indigo-500/30 shadow-2xl mb-6 bg-slate-800/50 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px]">
                    <img src={croppedImage} alt="Preview" className="w-full h-full object-contain relative z-10" />
                    
                    {/* Efeito de Scan (Mantido) */}
                    {scanning && (
                        <div className="absolute inset-0 z-20 overflow-hidden">
                            <div className="w-full h-1 bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,1)] absolute top-0 animate-scan-line"></div>
                            <div className="absolute inset-0 bg-indigo-500/10"></div>
                        </div>
                    )}

                    {/* Novo Loading para Remoção de Fundo */}
                    {removingBg && (
                        <div className="absolute inset-0 z-30 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-2">
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                          <span className="text-xs font-medium">Removendo fundo...</span>
                        </div>
                    )}
                </div>

                {/* Botões de Ação da Etapa 3 */}
                <div className="flex flex-col items-center gap-4">
                    {scanning ? (
                          <div className="flex flex-col items-center gap-2">
                              <ScanLine className="w-6 h-6 text-indigo-400 animate-pulse" />
                              <span className="text-slate-300 animate-pulse">Classificando imagem...</span>
                          </div>
                    ) : (
                        <div className="flex flex-col gap-3 w-full max-w-xs">
                            
                            {/* NOVO BOTÃO: Voltar e Recortar */}
                            <button
                                onClick={handleRecrop}
                                disabled={removingBg}
                                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 text-slate-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <RotateCcw size={16} /> Refazer Recorte
                            </button>
                            
                            {/* Botão Remover Fundo (Mantido) */}
                            <button
                                onClick={handleRemoveBackground}
                                disabled={removingBg}
                                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 text-slate-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <Eraser size={16} /> {removingBg ? "Processando..." : "Remover Fundo (Beta)"}
                            </button>

                            {/* Botão Original: Classificar */}
                            <button
                                onClick={handleIdentify}
                                disabled={removingBg}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-70 text-white rounded-full font-bold shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <Sparkles size={18} /> Classificar Produto
                            </button>
                        </div>
                    )}
                </div>
            </div>
          )}

          {/* --- STEP 4: EDIT & SEARCH (Mantido, apenas ajustado o object-fit da imagem lateral) --- */}
          {step === 4 && (
            <div className="flex-1 flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-8 duration-500">
                
                {/* Coluna Esquerda: Imagem e Categoria da IA */}
                <div className="w-full md:w-1/3 bg-slate-900/50 border-b md:border-b-0 md:border-r border-white/5 p-8 flex flex-col items-center pt-12 relative">
                      <div className="relative group mb-6">
                        <img 
                            src={croppedImage} 
                            alt="Produto" 
                            // mudei para object-contain para imagens sem fundo não distorcerem
                            className="w-32 h-32 object-contain bg-slate-800/50 rounded-xl shadow-lg ring-2 ring-white/10 p-2" 
                        />
                        <div className="absolute -bottom-3 -right-3 bg-indigo-600 p-2 rounded-full text-white shadow-lg border-2 border-slate-900">
                            <Tag size={16} />
                        </div>
                      </div>
                      
                      {/* Badge de Categoria Detectada */}
                      <div className="w-full text-center">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">IA Detectou</p>
                        <div className="inline-block px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300 font-medium text-sm">
                            {categoriaDetectada}
                        </div>
                      </div>
                </div>

                {/* Coluna Direita (Mantida idêntica) */}
<div className="w-full md:w-2/3 p-8 flex flex-col">
    <div className="mb-8">
        
        {/* NOVO DIV para o texto "Buscando em", posicionado ACIMA do label principal */}
        <div className="text-xs text-slate-500 italic mb-2 text-right">
            Buscando em: {categoriaDetectada}
        </div>
        
        <label className="text-slate-300 text-sm font-medium mb-2 block">
            Qual o modelo exato?
        </label>
        
        <div className="flex gap-2">
            <div className="relative flex-1 group">
                
                {/* REMOVIDO: O div que causava a sobreposição */}
                {/* <div className="absolute -top-7 right-0 text-xs text-slate-500 italic">
                    Buscando em: {categoriaDetectada}
                </div> */}
                
                <input 
                    type="text" 
                    value={modeloUsuario}
                    onChange={(e) => setModeloUsuario(e.target.value)}
                    placeholder="Ex: iPhone 13 Pro Max 256GB"
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-4 py-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
                />
            </div>
            <button 
                onClick={handleBuscarPreco}
                disabled={buscandoPreco || !modeloUsuario}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-semibold transition-all flex items-center justify-center min-w-[80px] shadow-lg shadow-indigo-600/20"
            >
                {buscandoPreco ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Search size={24} />}
            </button>
        </div>
    </div>

                    <div className="w-full h-px bg-white/10 mb-8"></div>

                    {/* Área de Resultados */}
                    <div className="flex-1">
                        {!resultadoPreco && !buscandoPreco && (
                             <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60 min-h-[150px]">
                                <ShoppingBag size={48} className="mb-4 text-slate-700" />
                                <p className="text-center max-w-xs">
                                    Digite o modelo acima para encontrarmos as melhores ofertas na categoria 
                                    <span className="text-indigo-400 block mt-1 font-medium">{categoriaDetectada}</span>
                                </p>
                             </div>
                        )}

                        {buscandoPreco && (
                            <div className="space-y-4">
                                <div className="h-32 bg-white/5 rounded-2xl animate-pulse border border-white/5"></div>
                            </div>
                        )}

                        {resultadoPreco && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-semibold flex items-center gap-2">
                                        <Check size={16} className="text-green-400" /> Disponível
                                    </h3>
                                    <span className="text-slate-400 text-xs">Atualizado agora</span>
                                </div>
                                
<div className="bg-slate-900 border border-indigo-600/50 rounded-3xl p-6 sm:p-8 relative overflow-hidden group shadow-2xl transition-all duration-300 hover:shadow-indigo-500/30">
    {/* 🌟 Efeito de Destaque Sutil */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 opacity-95 rounded-3xl z-0"></div>
    
    <div className="flex flex-col gap-6 relative z-10">
        
        {/* 📊 Preço Médio (Superior) */}
        <div className="mb-4 pb-4 border-b border-slate-700/50">
            <p className="text-slate-400 text-sm uppercase font-semibold mb-1 tracking-wider">Preço Médio Estimado</p>
            <span className="text-2xl font-bold text-indigo-400 tracking-tight">{resultadoPreco.precoMedio}</span>
        </div>

        {/* Informações Principais do Produto + Botão CTA */}
        {/* MUDANÇA: Removido 'md:flex-row' para forçar o empilhamento em todas as telas */}
        <div className="flex flex-col justify-between items-start gap-6"> 
            
            {/* CONTAINER 1: Informações do Produto */}
            <div className="w-full min-w-0"> 
                <p className="text-indigo-400 text-sm font-semibold uppercase mb-2 tracking-widest">{resultadoPreco.loja}</p>
                
                <h2 className="text-2xl font-extrabold text-white mb-3 leading-tight">
                    {resultadoPreco.produtoFull}
                </h2>
                
                {/* 💰 Destaque do Preço */}
                <div className="mt-4 overflow-hidden"> 
                    <span className="text-4xl sm:text-5xl font-extrabold text-emerald-300 tracking-tight block min-w-0">
                        {resultadoPreco.valor}
                    </span>
                </div>
                
                {/* ⏳ Detalhes de Parcelamento */}
                <p className="text-slate-400 text-base mt-2">{resultadoPreco.parcelamento}</p>
            </div>
            
            {/* CONTAINER 2: Botão de Ação (CTA) */}
            {/* Adicionado 'mt-4' (ou o espaçamento desejado) para separar do texto de parcelamento */}
            <a 
                href={resultadoPreco.link} 
                target="_blank"
                rel="noopener noreferrer"
                // O botão agora é 'w-full' em todas as telas para manter a consistência do bloco
                className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 px-8 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-xl transform hover:-translate-y-0.5 hover:shadow-emerald-500/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
            >
                Ir para Loja <ArrowRight size={18} />
            </a>
        </div>
        
        {/* ⚠️ Aviso de Preço Ilustrativo (Inferior) */}
        <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
            <p className="text-slate-600 text-xs italic">
                Aviso: Preços meramente ilustrativos. 
            </p>
        </div>
    </div>
</div>

                                <div className="mt-8 text-center">
                                    <button onClick={handleReset} className="text-slate-500 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition group">
                                        <RotateCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500"/> Fazer nova pesquisa
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
          )}

        </div>
        
        {/* Footer (Mantido) */}
        <footer className="mt-12 text-center text-slate-600 text-sm">
            <Link to="/" className="hover:text-indigo-400 transition">
                &copy; PreçoJá - AI Powered Search
            </Link>
        </footer>

      </main>

      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}