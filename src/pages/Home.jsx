// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Camera,
  ShieldCheck, 
  ScanSearch,
  ArrowRight, 
  Coins, 
  Users, 
  Zap, 
  Sparkles,
  Search,
  UploadCloud,
  ScanLine,
  Tag,
  Rocket, // Novo ícone para a seção de Benefícios Principais
  Database, // Novo ícone para a seção de Benefícios Principais
  HandCoins // Novo ícone para a seção de Benefícios Principais
} from "lucide-react";


export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  // Benefícios Principais (Antigo Grid Cards) - Mais focado no VALOR
  const mainBenefits = [
    {
      icon: <Camera className="w-6 h-6 text-amber-300" />,
      title: "Análise por Imagem",
      text: "Tire uma foto e nossa IA identifica o produto automaticamente para estimar o preço médio de mercado.",
      gradient: "from-amber-500/20 to-yellow-500/5",
      border: "group-hover:border-amber-500/50"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-300" />,
      title: "Confiança nos Dados",
      text: "A IA cruza dados de centenas de e-commerces, filtrando preços irreais para a avaliação mais confiável.",
      gradient: "from-emerald-500/20 to-teal-500/5",
      border: "group-hover:border-emerald-500/50"
    },
    {
      icon: <ScanSearch className="w-6 h-6 text-purple-300" />,
      title: "Resultado Imediato",
      text: "Envie a imagem e receba a estimativa de preço em poucos segundos, agilizando sua pesquisa.",
      gradient: "from-purple-500/20 to-pink-500/5",
      border: "group-hover:border-purple-500/50"
    },
  ];

  // Features Técnicas/Detalhes (Abaixo dos Benefícios)
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-pink-400" />,
      title: "Processamento Ultrarrápido",
      text: "Identificação do produto e cálculo do preço em menos de 5 segundos.",
      delay: "duration-500"
    },
    {
      icon: <Database className="w-5 h-5 text-indigo-400" />,
      title: "Big Data de Preços",
      text: "Base de dados gigantesca com histórico de preços e tendências de mercado.",
      delay: "duration-700"
    },
    {
      icon: <HandCoins className="w-5 h-5 text-amber-400" />,
      title: "Estimativa Realista",
      text: "Valores baseados na média de mercado, garantindo uma precificação justa.",
      delay: "duration-900"
    }
  ];

  // FAQ
  const faqs = [
    {
      question: "Como a IA identifica o produto?",
      answer: "A imagem é analisada por visão computacional avançada, comparada com um grande banco de dados e categorizada automaticamente em tempo real."
    },
    {
      question: "A estimativa de preço é confiável?",
      answer: "Sim. A IA busca valores em lojas reais, filtra outliers (preços muito discrepantes) e calcula a média ponderada do mercado para alta precisão."
    },
    {
      question: "Posso usar sem criar conta?",
      answer: "Sim, a análise básica é aberta para qualquer usuário que queira experimentar a nossa IA."
    }
  ];

  // Novo: Seção de Prova Social (Simulada, mas crucial para persuasão)
  const testimonials = [
    {
      quote: "Estimo meus itens de brechó em segundos e não perco mais vendas por preço errado!",
      name: "Sophia",
      role: "Empreendedora de E-commerce"
    },
    {
      quote: "Essencial para quem compra e revende. A precisão dos preços é impressionante.",
      name: "Soares",
      role: "Investidor de Mercado"
    },
    {
      quote: "Nunca mais precisei pesquisar manualmente em 10 sites. É só tirar a foto e pronto.",
      name: "Maria",
      role: "Usuária Casual"
    },
  ]

  return (
    <div className="relative min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Fundo com efeito de luz */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className={`relative z-10 w-full flex flex-col items-center transition-all duration-1000 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

        {/* Navbar */}
        <nav className="w-full p-6 max-w-7xl mx-auto flex justify-between items-center opacity-90">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Search size={18} className="text-white" />
            </div>
            <span>
              Preço<span className="text-indigo-400">Já</span>
            </span>
          </Link>
        </nav>


        {/* Hero */}
        <header className="text-center max-w-5xl px-6 mt-16 mb-32 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md mb-8 animate-in fade-in zoom-in duration-700">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase">Tecnologia de Precificação por IA</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 text-white leading-[1.1]">
            Descubra o valor, <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 animate-gradient-x">
                direto da sua foto.
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-10 text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Nossa Inteligência Artificial identifica produtos por imagem e calcula o preço médio de mercado mais preciso em segundos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link
                to="/Projeto"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-xl hover:bg-indigo-500 hover:scale-[1.03] hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.7)] focus:outline-none ring-offset-2 ring-offset-slate-950 focus:ring-2 ring-indigo-400"
            >
                <span>Começar Análise Agora</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
                to="/sobre"
                className="inline-flex items-center justify-center px-8 py-4 font-bold text-slate-300 transition-all duration-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white"
            >
                Como funciona
            </Link>
          </div>
        </header>

        {/* BENEFÍCIOS PRINCIPAIS (Grid Cards - Movido para o topo, após o Hero) */}
        <section className="max-w-7xl mx-auto px-6 mb-32 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mainBenefits.map((section, i) => (
              <div
                key={i}
                className={`group relative p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${section.border}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                        {section.icon}
                    </div>

                    <h2 className="text-xl font-bold mb-3 text-white">
                        {section.title}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                        {section.text}
                    </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DETALHES/PROVA TÉCNICA (Features - Movido para aqui) */}
        <section className="w-full bg-white/[0.02] border-y border-white/5 py-24 mb-24">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tecnologia por Trás da Precisão</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Por que a estimativa do PreçoJá é a mais confiável do mercado.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
              {features.map((f, i) => (
                  <div key={i} className={`group flex flex-col md:flex-row items-center md:items-start gap-4 transition-all ${f.delay} ease-out`}>
                    <div className="p-3 rounded-xl bg-slate-800 border border-white/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors shadow-lg">
                        {f.icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-1 text-white">{f.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{f.text}</p>
                    </div>
                  </div>
              ))}
              </div>
            </div>
        </section>
        
        {/* COMO FUNCIONA (A ordem lógica do fluxo) */}
        <section className="w-full py-24">
          <div className="max-w-6xl mx-auto px-6 text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Comece a precificar em 4 passos simples
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Veja como é fácil e rápido descobrir o valor de qualquer produto usando nossa IA.
            </p>
          </div>

          {/* Grid de 4 passos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
            
            {/* PASSO 1 */}
            <div className="relative group bg-slate-900/40 border border-white/10 rounded-2xl p-6 
                          text-center backdrop-blur-sm shadow-xl transition-all duration-500 
                          hover:-translate-y-1 hover:shadow-indigo-500/10 hover:border-indigo-500/30">
              
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 
                              group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 rounded-xl 
                                flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <UploadCloud size={28} />
                </div>

                <h3 className="text-white font-semibold text-lg mb-2">1. Envie a Foto</h3>
                <p className="text-slate-400 text-sm">
                  Faça upload ou tire uma foto do produto que deseja avaliar.
                </p>
              </div>
            </div>

            {/* PASSO 2 */}
            <div className="relative group bg-slate-900/40 border border-white/10 rounded-2xl p-6 
                          text-center backdrop-blur-sm shadow-xl transition-all duration-500 
                          hover:-translate-y-1 hover:shadow-indigo-500/10 hover:border-indigo-500/30">
              
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 
                              group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 rounded-xl 
                                flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <ScanLine size={28} />
                </div>

                <h3 className="text-white font-semibold text-lg mb-2">2. Confirme o Enquadramento</h3>
                <p className="text-slate-400 text-sm">
                  Ajuste o corte ou avance direto para focar no item principal.
                </p>
              </div>
            </div>

            {/* PASSO 3 */}
            <div className="relative group bg-slate-900/40 border border-white/10 rounded-2xl p-6 
                          text-center backdrop-blur-sm shadow-xl transition-all duration-500 
                          hover:-translate-y-1 hover:shadow-indigo-500/10 hover:border-indigo-500/30">
              
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 
                              group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 rounded-xl 
                                flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <Sparkles size={28} />
                </div>

                <h3 className="text-white font-semibold text-lg mb-2">3. Análise da IA</h3>
                <p className="text-slate-400 text-sm">
                  A IA analisa a foto, identifica o item e pesquisa no mercado.
                </p>
              </div>
            </div>

            {/* PASSO 4 */}
            <div className="relative group bg-slate-900/40 border border-white/10 rounded-2xl p-6 
                          text-center backdrop-blur-sm shadow-xl transition-all duration-500 
                          hover:-translate-y-1 hover:shadow-indigo-500/10 hover:border-indigo-500/30">
              
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 
                              group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 rounded-xl 
                                flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <Tag size={28} />
                </div>

                <h3 className="text-white font-semibold text-lg mb-2">4. Preço Final</h3>
                <p className="text-slate-400 text-sm">
                  Receba a estimativa de preço, gráficos de histórico e links de comparação.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* NOVO: Prova Social / Testemunhos (Colocada antes do FAQ para criar confiança) */}
        <section className="w-full bg-slate-900/30 border-y border-white/5 py-24 mb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">O que dizem nossos usuários</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                      Pessoas reais que encontraram o preço certo com o PreçoJá.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-slate-900/70 p-8 rounded-2xl border border-white/10 shadow-xl">
                            <blockquote className="text-lg italic text-slate-300 mb-6 leading-relaxed">
                                "{t.quote}"
                            </blockquote>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-indigo-500 rounded-full mr-3 flex items-center justify-center text-sm font-bold">
                                  {t.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{t.name}</p>
                                    <p className="text-xs text-indigo-400">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>


        {/* FAQ (Para resolver as últimas objeções) */}
        <section className="w-full max-w-3xl mx-auto px-6 mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Dúvidas Comuns</h2>
            <p className="text-slate-400">Tudo o que você precisa saber antes de começar a precificar.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-colors cursor-default">
                <h3 className="font-semibold text-lg text-white mb-2 flex items-center gap-2">
                    <span className="text-indigo-500">Q.</span> {faq.question}
                </h3>
                <p className="text-slate-400 text-sm pl-6 border-l-2 border-slate-800 ml-1">
                    {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>


        {/* CTA (Chamada Final à Ação) */}
        <section className="max-w-4xl mx-auto px-6 mb-24 w-full">
            <div className="relative rounded-3xl overflow-hidden p-12 text-center border border-white/10 bg-gradient-to-b from-indigo-900/20 to-slate-900/50">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
                
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Pronto para ter o preço certo, sem complicação?</h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                        Junte-se a milhares de usuários que economizam tempo e ganham confiança em seus negócios com a precisão do PreçoJá.
                    </p>
                    <Link
                      to="/Projeto"
                      className="inline-flex items-center justify-center px-10 py-4 font-bold 
                                text-white bg-indigo-600 rounded-full transition-all duration-300 
                                hover:bg-indigo-500 hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.7)] 
                                hover:scale-105 border border-indigo-500/30"
                    >
                      <span>Começar Minha Primeira Análise</span>
                      <Rocket className="w-5 h-5 ml-2" />
                    </Link>

                </div>
            </div>
        </section>

        <footer className="w-full py-8 border-t border-white/5 text-center">
          <p className="text-slate-600 text-sm">
            © 2025 Projeto PreçoJá. Tecnologia de Visão Computacional.
          </p>
        </footer>

      </div>
    </div>
  );
}