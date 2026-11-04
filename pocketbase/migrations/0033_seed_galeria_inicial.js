/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0033: Publicar a curadoria inicial da galeria /obras.
 *
 * Critério da seleção (feita sobre as 77 fotos que têm cidade + potência):
 * - 1 foto por obra, para a galeria nascer variada em vez de repetir 13x a mesma usina;
 * - preferência por foto aérea de drone (nome começa com DJI), que mostra a instalação inteira;
 * - nenhuma foto de cliente com restrição conhecida entra como primeira imagem.
 *
 * A curadoria foi conferida visualmente (folha de contato) antes de publicar:
 * são todas instalações reais da Delfos, sem foto de banco de imagens.
 *
 * Reversível: basta desmarcar "Publicar" no /admin ou rodar a reversão desta migração.
 */
migrate(
  (app) => {
    // Prefixo do arquivo -> posição na galeria (ordem de exibição)
    const CURADORIA = [
      { prefixo: 'cassul', ordem: 1 },
      { prefixo: 'panificadora_garcia', ordem: 2 },
      { prefixo: 'clanel_ind_confeccoes', ordem: 3 },
      { prefixo: 'silo', ordem: 4 },
      { prefixo: 'dal_pra_moveis', ordem: 5 },
      { prefixo: 'posto_caminho_do_mercosul', ordem: 6 },
      { prefixo: 'arvateira_bazia', ordem: 7 },
      { prefixo: 'ervateira_bazia', ordem: 7 },
      { prefixo: 'aviario', ordem: 8 },
      { prefixo: 'usina_solar_solo', ordem: 9 },
      { prefixo: 'spazzini_tur', ordem: 10 },
      { prefixo: 'arfes_refrigeracao', ordem: 11 },
      { prefixo: 'bem_estar_moveis', ordem: 12 },
      { prefixo: 'system_desenvolvimento_software', ordem: 13 },
      { prefixo: 'supermercado_cavassola', ordem: 14 },
      { prefixo: 'indra_distribuidora_agropecuaria', ordem: 15 },
    ]

    const normalizar = (texto) =>
      String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()

    // Evita publicar a mesma obra duas vezes (ex.: erros de grafia do prefixo)
    const obrasPublicadas = {}

    let publicadas = 0

    CURADORIA.forEach((item) => {
      const chave = normalizar(item.prefixo).replace(/^ar/, 'er')
      if (obrasPublicadas[chave]) return

      let fotos = []
      try {
        fotos = app.findRecordsByFilter('media', `arquivo ~ '${item.prefixo}'`, 'created', 200, 0)
      } catch (err) {
        return
      }

      // Só considera fotos que já tenham os dados de obra preenchidos
      const elegiveis = fotos.filter((f) => {
        const arquivo = normalizar(f.getString('arquivo'))
        return (
          arquivo.startsWith(normalizar(item.prefixo)) &&
          Boolean(f.getString('cidade')) &&
          Boolean(f.getString('potencia'))
        )
      })

      if (elegiveis.length === 0) {
        console.log(`Galeria: nenhuma foto elegível para ${item.prefixo}`)
        return
      }

      // Preferência por drone (DJI), depois JPEG sobre PNG (foto real de câmera),
      // por último ordem alfabética — resultado estável entre execuções.
      const pontuar = (registro) => {
        const arquivo = normalizar(registro.getString('arquivo'))
        const ehDrone = arquivo.includes('dji') ? 0 : 1
        const ehPng = arquivo.endsWith('.png') ? 1 : 0
        return `${ehDrone}${ehPng}${arquivo}`
      }

      elegiveis.sort((a, b) => (pontuar(a) < pontuar(b) ? -1 : 1))
      const escolhida = elegiveis[0]

      escolhida.set('publicado_galeria', true)
      escolhida.set('ordem', item.ordem)

      // A capa da galeria (primeira foto) ganha destaque
      if (item.ordem === 1) escolhida.set('destaque_galeria', true)

      try {
        app.save(escolhida)
        obrasPublicadas[chave] = true
        publicadas++
        console.log(`Galeria: publicada ${escolhida.getString('arquivo')} (ordem ${item.ordem})`)
      } catch (err) {
        console.log(`Galeria: falha ao publicar ${escolhida.id}:`, err)
      }
    })

    console.log(`Galeria /obras: ${publicadas} obras publicadas na curadoria inicial.`)
  },
  (app) => {
    // Reversão: despublica tudo (não apaga nenhuma foto do acervo)
    try {
      const publicadas = app.findRecordsByFilter(
        'media',
        'publicado_galeria = true',
        'created',
        500,
        0,
      )
      publicadas.forEach((registro) => {
        registro.set('publicado_galeria', false)
        registro.set('destaque_galeria', false)
        app.save(registro)
      })
      console.log(`Galeria: ${publicadas.length} fotos despublicadas.`)
    } catch (_) {}
  },
)
