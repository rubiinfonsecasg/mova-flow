export interface DailyMessage {
  text: string;
  verseText: string;
  verseRef: string;
}

const MESSAGES: DailyMessage[] = [
  { text: "O sucesso nasce do querer, da determinação e persistência em se chegar a um objetivo. Mesmo não atingindo o alvo, quem busca e vence obstáculos, no mínimo, fará coisas admiráveis.", verseText: "Portanto, não percam a coragem, pois ela traz uma grande recompensa.", verseRef: "Hebreus 10:35" },
  { text: "Grandes resultados vêm de pequenas ações repetidas todos os dias. Foque no próximo passo, não na montanha inteira.", verseText: "Tudo posso naquele que me fortalece.", verseRef: "Filipenses 4:13" },
  { text: "A criatividade é a inteligência se divertindo. Não tenha medo de tentar algo diferente hoje.", verseText: "Não te mandei eu? Sê forte e corajoso; não temas, nem te espantes, porque o Senhor teu Deus é contigo.", verseRef: "Josué 1:9" },
  { text: "Um cliente satisfeito é a melhor estratégia de marketing que existe. Entregue mais do que promete.", verseText: "Tudo o que fizerem, façam de todo o coração, como para o Senhor.", verseRef: "Colossenses 3:23" },
  { text: "Disciplina é escolher entre o que você quer agora e o que você mais quer.", verseText: "O Senhor é o meu pastor, nada me faltará.", verseRef: "Salmos 23:1" },
  { text: "Toda entrega bem feita hoje constrói a reputação que vai trazer o próximo cliente amanhã.", verseText: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", verseRef: "Provérbios 3:5" },
  { text: "Ideias não valem nada sem execução. Comece pequeno, mas comece hoje.", verseText: "Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu.", verseRef: "Eclesiastes 3:1" },
  { text: "Equipes fortes se constroem com confiança e comunicação clara — cuide da sua tanto quanto do seu produto.", verseText: "Melhor é serem dois do que um, porque têm melhor paga do seu trabalho.", verseRef: "Eclesiastes 4:9" },
  { text: "O feedback é um presente. Ouça mais do que fala e sua marca vai crescer mais rápido.", verseText: "O que ouve o conselho é sábio.", verseRef: "Provérbios 12:15" },
  { text: "Consistência vence talento quando o talento não é consistente.", verseText: "Não nos cansemos de fazer o bem, pois no tempo próprio colheremos, se não desanimarmos.", verseRef: "Gálatas 6:9" },
  { text: "Todo grande projeto começou como um simples rascunho. Não subestime o primeiro passo.", verseText: "Antes de tudo, o Senhor deu início a essa boa obra em vocês, e ele a completará.", verseRef: "Filipenses 1:6" },
  { text: "Marcas fortes não gritam mais alto, contam a verdade com mais clareza.", verseText: "A tua palavra é lâmpada para os meus pés e luz para o meu caminho.", verseRef: "Salmos 119:105" },
  { text: "O cansaço é temporário, desistir é definitivo. Descanse, mas não desista.", verseText: "Vinde a mim todos os que estais cansados e sobrecarregados, e eu vos aliviarei.", verseRef: "Mateus 11:28" },
  { text: "Cada 'não' te aproxima do próximo 'sim'. Continue tentando.", verseText: "Pedi, e dar-se-vos-á; buscai, e encontrareis; batei, e abrir-se-vos-á.", verseRef: "Mateus 7:7" },
  { text: "Planejamento sem ação é só um sonho bonito. Ação sem planejamento é caos. Faça os dois.", verseText: "Os planos bem elaborados levam à fartura.", verseRef: "Provérbios 21:5" },
  { text: "A forma como você trata os pequenos detalhes é a forma como você trata o cliente inteiro.", verseText: "Aquele que é fiel no pouco também é fiel no muito.", verseRef: "Lucas 16:10" },
  { text: "Coragem não é a ausência de medo, é agir apesar dele.", verseText: "Porque Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação.", verseRef: "2 Timóteo 1:7" },
  { text: "O melhor jeito de prever o futuro da sua agência é construí-lo, um cliente satisfeito por vez.", verseText: "Sem mim nada podeis fazer.", verseRef: "João 15:5" },
  { text: "Gratidão transforma o que temos em suficiente. Comece o dia contando o que já deu certo.", verseText: "Em tudo dai graças, porque esta é a vontade de Deus.", verseRef: "1 Tessalonicenses 5:18" },
  { text: "Prazos existem para dar ritmo, não para tirar a qualidade. Organize-se com antecedência.", verseText: "Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria.", verseRef: "2 Coríntios 9:7" },
  { text: "Sua reputação é construída nos detalhes que ninguém pediu, mas você entregou.", verseText: "E tudo quanto fizerdes, fazei-o de todo o coração.", verseRef: "Colossenses 3:23" },
  { text: "Erros são só dados — use-os para ajustar a rota, não para parar de andar.", verseText: "As nossas fraquezas são a ocasião para o seu poder se manifestar.", verseRef: "2 Coríntios 12:9" },
  { text: "Quem cuida bem da equipe, cuida bem do cliente sem nem perceber.", verseText: "Amai-vos uns aos outros; assim como eu vos amei.", verseRef: "João 13:34" },
  { text: "Toda campanha de sucesso começou com alguém disposto a testar antes de ter certeza.", verseText: "Provai tudo, retende o bem.", verseRef: "1 Tessalonicenses 5:21" },
  { text: "Você não precisa ver o caminho inteiro, só o próximo passo.", verseText: "Porque andamos por fé, e não por vista.", verseRef: "2 Coríntios 5:7" },
  { text: "O trabalho bem feito fala mais alto do que qualquer post de divulgação.", verseText: "Que a vossa luz assim brilhe diante dos homens, para que vejam as vossas boas obras.", verseRef: "Mateus 5:16" },
  { text: "Foco é dizer não para cem boas ideias e sim para a única que importa agora.", verseText: "Uma coisa faço: esquecendo-me das coisas que atrás ficam e avançando para as que estão diante de mim.", verseRef: "Filipenses 3:13" },
  { text: "Paz não é ausência de prazos apertados, é confiança de que você está no controle do que pode controlar.", verseText: "Deixo-vos a paz, a minha paz vos dou.", verseRef: "João 14:27" },
  { text: "Boas parcerias se constroem com transparência — mesmo quando a notícia não é a que o cliente queria ouvir.", verseText: "Andai na verdade, com amor.", verseRef: "Efésios 4:15" },
  { text: "Comece o dia como quer terminá-lo: com propósito.", verseText: "Tudo o que a tua mão achar para fazer, faze-o conforme as tuas forças.", verseRef: "Eclesiastes 9:10" },
];

export function getDailyMessage(date: Date = new Date()): DailyMessage {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  return MESSAGES[dayOfYear % MESSAGES.length];
}
