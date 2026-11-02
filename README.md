# Residencial Pôr do Sol

Landing page em HTML, CSS e JavaScript, sem build. Abra `index.html` ou use `python -m http.server 8765` na pasta do site.

## WhatsApp
No topo de `js/app.js`, troque `CONFIG.whatsapp` por um número completo, somente dígitos, incluindo 55 e DDD. O placeholder é intencional, conforme briefing. Sem número configurado, nenhum contato fictício é aberto: o formulário orienta usar o Instagram. O anúncio consultado informa (48) 99159-7532 (Vanessa); confirme antes de ativar.

## Bloquear datas
Edite `CONFIG.blockedDates`:
```js
blockedDates: [
  { from: '2026-12-24', to: '2026-12-31' },
  { from: '2027-01-10', to: '2027-01-15' }
]
```
Os dois extremos são inclusivos; check-in e check-out não podem cair em dias bloqueados. Uma estadia que atravessa um bloqueio também é rejeitada. A lista começa vazia: não é informação de disponibilidade real. Como há quatro apartamentos, use bloqueios globais somente quando não houver unidade disponível. O formulário solicita disponibilidade, não confirma reservas, não cobra e não mantém inventário. O adaptador `availability.load()` está separado para futura API/iCal; essa integração ainda não existe.

## Fotos e textos
Fotos locais WebP em `assets/img`, largura máxima de 1600px. Substitua os arquivos preservando os nomes ou edite os `src` e textos alternativos no HTML. A primeira foto carrega prioritariamente, as demais com lazy loading. Galeria com lightbox, setas e Escape. Para acrescentar uma foto, adicione um botão `.gallery-photo` com uma imagem no HTML. Endereço e links podem ser ajustados no bloco CONFIG; atualize também os dados estruturados do HTML se mudar a localização física.

## Fontes e pendências
- Briefing do proprietário: distância de 150m, rua tranquila e posicionamento do negócio.
- https://www.praiadapinheira.com/residencialpordosol.htm — referência ao mesmo Instagram, fotos vanessaderner29.jpg a vanessaderner50.jpg e comodidades.
- https://www.pontadopapagaiosc.com.br/residencial-por-do-sol-pinheira — Rua Sol e Mar. Não foi encontrado número de porta confirmado.
- Instagram bloqueou acesso automatizado. Google Maps não disponibilizou avaliações na consulta. Nenhum depoimento, nota ou quantidade de avaliações foi inventado; há link para consulta no Google.
- Foram obtidas fotos reais de fachada, áreas externas, quartos, sala, cozinha, churrasqueira e banheiros por fonte alternativa. Não foi obtida foto da praia verificada nestas fontes; não foi usada imagem genérica nem atribuída uma praia desconhecida à Pinheira.
- Confirmar atualidade de comodidades e telefone antes de divulgação. Distâncias e capacidade seguem briefing/anúncio; não foram medidos presencialmente.

## Publicar
Este repositório tem `index.html` na raiz e não exige instalação ou build.
- GitHub Pages: em Settings → Pages, selecione Deploy from a branch, branch `main`, pasta `/ (root)` e salve.
- Netlify: importe este repositório, deixe o comando de build vazio e diretório de publicação `.`. Também é possível arrastar a pasta que contém `index.html` para publicação manual.
- Vercel: importe o repositório, selecione Other, sem build e saída `.`.
A publicação no GitHub dos commits não ativa automaticamente o GitHub Pages. Ajuste `og:image` para o domínio definitivo. Google Fonts e mapa dependem de serviços externos; flatpickr está incluído localmente (licença MIT em `js/flatpickr-LICENSE.md`).

## Verificação
Sete testes de lógica de datas passaram: duração normal, passado, datas iguais, saída anterior, intervalo atravessando bloqueio, virada de ano e ano bissexto. Sintaxe JS validada pelo Node. Página e abertura da galeria conferidas no navegador. Não foi realizado teste Lighthouse nem envio real no WhatsApp (número mantido como placeholder).
