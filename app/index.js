const express = require('express');

const app = express();

// const apicache = require('apicache');
// const cache = apicache.middleware;
// app.use(cache('5 minutes'));

app.use(express.json());

const lista_produtos = {
    produtos: [
        { id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João" },
        { id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans" },
        { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé" },
        { id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps" },
        { id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé" },
    ]
}

const crypto = require('crypto');

// Rota para obter todos os produtos
app.get('/produtos', /*cache('5 minutes')*/ (req, res) => {
    let hash = crypto.createHash('sha1').update(JSON.stringify(lista_produtos.produtos)).digest('hex');
    if (req.headers['If-None-Match'] === hash) {
        res.status(304).send();
    } else {
        res.setHeader('ETag', hash);
        return res.status(200).json(lista_produtos.produtos);
    }
});

// Rota para obter um produto específico
app.get('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = lista_produtos.produtos.find(prod => prod.id === id);
    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }
    res.status(200).json(produto);
});

// Rota para incluir um novo produto
let idCounter = 6;

app.post('/produtos', (req, res) => {
    const novoProduto = req.body;
    novoProduto.id = idCounter;

    const newProduct = {
      id: idCounter,
      descricao: novoProduto.descricao,
      valor: novoProduto.valor,
      marca: novoProduto.marca,
    };
  
    lista_produtos.produtos.push(newProduct);
  
    idCounter++;
  
    const hash = crypto.createHash('sha1').update(JSON.stringify(lista_produtos)).digest('hex');

    // apicache.clear('/produtos');
  
    res.setHeader('ETag', hash);
  
    res.status(201).json({
      message: 'Produto criado com sucesso!',
      product: newProduct,
    });
  });

// Rota para alterar um produto existente
app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produtoIndex = lista_produtos.produtos.findIndex(prod => prod.id === id);

    if (produtoIndex === -1) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    const { descricao, valor, marca } = req.body;

    lista_produtos.produtos[produtoIndex].descricao = descricao;
    lista_produtos.produtos[produtoIndex].valor = valor;
    lista_produtos.produtos[produtoIndex].marca = marca;

    const hash = crypto.createHash('sha1').update(JSON.stringify(lista_produtos)).digest('hex');

    //apicache.clear('/produtos');
  
    res.setHeader('ETag', hash)

    res.status(200).json({
        message: 'Produto atualizado com sucesso!',
        product: lista_produtos.produtos[produtoIndex],
    });
});

// Rota para excluir um produto
app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produtoIndex = lista_produtos.produtos.findIndex(prod => prod.id === id);

    if (produtoIndex === -1) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    lista_produtos.produtos.splice(produtoIndex, 1);

    const hash = crypto.createHash('sha1').update(JSON.stringify(lista_produtos)).digest('hex');

    //apicache.clear('/produtos');
  
    res.setHeader('ETag', hash);

    res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});