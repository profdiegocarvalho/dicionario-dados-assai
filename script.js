/**
 * Dicionário de Dados Corporativo - Assaí Atacadista
 * Metadados extraídos integralmente do script DDL (script grupo 6.sql)
 * Governança alinhada a DAMA-DMBOK, COBIT, LGPD, CTN, CDC e Marco Civil da Internet.
 */

const SCHEMA_TABLES = [
    {
      name: "cidade",
      domain: "Localização & Logística",
      purpose: "Armazena os municípios e unidades federativas (UF) utilizados para normalizar os endereços de clientes e das unidades físicas (lojas e centros de distribuição) do Assaí Atacadista.",
      retention: "Permanente (Referência)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_cidade",
          description: "Identificador único sequencial do município no banco de dados.",
          type: "INT",
          constraints: ["[PK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "N/A",
          lineage: "Origem: Carga inicial IBGE / Cadastro administrativo | Destino: endereco.id_cidade, loja.id_cidade",
          rbac: "Leitura: Todos os perfis (Cliente, Gerente, Administrador) | Escrita: Administrador"
        },
        {
          name: "nome",
          description: "Nome oficial do município brasileiro sem abreviações.",
          type: "VARCHAR(100)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Base de localidades / Cadastro administrativo | Destino: Comprovante de pedido e telas de endereço",
          rbac: "Leitura: Todos os perfis | Escrita: Administrador"
        },
        {
          name: "uf",
          description: "Sigla da Unidade da Federação com exatamente 2 caracteres maiúsculos (ex: SP, RJ, MG).",
          type: "CHAR(2)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Base de localidades / Cadastro administrativo | Destino: Filtros regionais de lojas e entregas",
          rbac: "Leitura: Todos os perfis | Escrita: Administrador"
        }
      ]
    },
    {
      name: "categoria",
      domain: "Catálogo de Produtos",
      purpose: "Agrupa os itens comercializados no site de compras do Assaí em departamentos ou seções mercadológicas (ex: Mercearia, Bebidas, Limpeza, Perecíveis).",
      retention: "Exclusão lógica (ativo = 0)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_categoria",
          description: "Identificador único sequencial da categoria de produtos.",
          type: "INT",
          constraints: ["[PK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "N/A",
          lineage: "Origem: Sistema Administrativo (RF02) | Destino: produto.id_categoria",
          rbac: "Leitura: Todos os perfis (apenas ativas para Cliente) | Escrita: Gerente, Administrador"
        },
        {
          name: "nome",
          description: "Nome descritivo único da categoria comercial no catálogo.",
          type: "VARCHAR(80)",
          constraints: ["[NOT NULL]", "[UNIQUE]"],
          lgpd: "N/A",
          lineage: "Origem: Cadastro de Catálogo (Gerente/Admin) | Destino: Menu de navegação e filtros do e-commerce",
          rbac: "Leitura: Todos os perfis | Escrita: Gerente, Administrador"
        },
        {
          name: "ativo",
          description: "Indicador booleano (TINYINT) de disponibilidade da categoria: 1 = Ativa, 0 = Inativa (exclusão lógica).",
          type: "TINYINT",
          constraints: ["[NOT NULL]", "[DEFAULT 1]"],
          lgpd: "N/A",
          lineage: "Origem: Gestão de Catálogo (RF02) | Destino: Regra de exibição no site",
          rbac: "Leitura: Gerente, Administrador | Escrita: Gerente, Administrador"
        }
      ]
    },
    {
      name: "forma_pagamento",
      domain: "Financeiro & Checkout",
      purpose: "Define os meios de pagamento aceitos na finalização de pedidos no site (ex: Cartão de Crédito, PIX, Boleto Faturado PJ), sem armazenar dados sensíveis de cartão.",
      retention: "Exclusão lógica (ativo = 0)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_forma_pagamento",
          description: "Identificador único sequencial da forma de pagamento.",
          type: "INT",
          constraints: ["[PK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "N/A",
          lineage: "Origem: Painel Administrativo (RF09) | Destino: pedido.id_forma_pagamento",
          rbac: "Leitura: Todos os perfis (apenas ativas para Cliente) | Escrita: Administrador"
        },
        {
          name: "descricao",
          description: "Nome comercial único da forma de pagamento exibida no checkout.",
          type: "VARCHAR(60)",
          constraints: ["[NOT NULL]", "[UNIQUE]"],
          lgpd: "N/A",
          lineage: "Origem: Cadastro Administrativo (RF09) | Destino: Comprovante do pedido e relatórios financeiros",
          rbac: "Leitura: Todos os perfis | Escrita: Administrador"
        },
        {
          name: "ativo",
          description: "Indicador de habilitação no checkout: 1 = Ativa, 0 = Inativa. Registros inativos são bloqueados em novos pedidos (RN10).",
          type: "TINYINT",
          constraints: ["[NOT NULL]", "[DEFAULT 1]"],
          lgpd: "N/A",
          lineage: "Origem: Gestão Administrativa (RF09) | Destino: Validação BEFORE INSERT em pedido (RN10)",
          rbac: "Leitura: Gerente, Administrador | Escrita: Administrador"
        }
      ]
    },
    {
      name: "usuario",
      domain: "Segurança & Controle de Acesso",
      purpose: "Registra os colaboradores internos do Assaí Atacadista (Gerentes e Administradores) autorizados a operar a retaguarda administrativa, ajustar estoques e concluir estornos.",
      retention: "Exclusão lógica (ativo = 0)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_usuario",
          description: "Identificador único sequencial do colaborador interno.",
          type: "INT",
          constraints: ["[PK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "DP",
          lineage: "Origem: Gestão de Usuários (RF08) | Destino: ajuste_estoque.id_usuario, estorno.id_usuario, log_auditoria.id_usuario",
          rbac: "Leitura: Gerente (próprio), Administrador | Escrita: Administrador"
        },
        {
          name: "nome",
          description: "Nome completo do colaborador interno.",
          type: "VARCHAR(100)",
          constraints: ["[NOT NULL]"],
          lgpd: "DP",
          lineage: "Origem: Cadastro de Usuários Internos (RF08) | Destino: Relatórios de auditoria e ajuste de estoque",
          rbac: "Leitura: Gerente, Administrador | Escrita: Administrador"
        },
        {
          name: "login",
          description: "Identificador único de acesso corporativo utilizado na autenticação.",
          type: "VARCHAR(50)",
          constraints: ["[NOT NULL]", "[UNIQUE]"],
          lgpd: "DP",
          lineage: "Origem: Cadastro de Usuários Internos (RF08) | Destino: Autenticação e log_auditoria",
          rbac: "Leitura: Administrador | Escrita: Administrador"
        },
        {
          name: "senha_hash",
          description: "Resumo criptográfico irreversível da senha (Argon2id ou bcrypt custo >= 12). Nunca armazenada nem consultada em texto claro (RNF09).",
          type: "VARCHAR(255)",
          constraints: ["[NOT NULL]"],
          lgpd: "DPS",
          lineage: "Origem: Camada de Autenticação (hash na aplicação) | Destino: Validação interna de login (nunca exportada)",
          rbac: "Leitura: Restrito ao serviço de autenticação (bloqueado para perfis humanos) | Escrita: Administrador / Serviço Auth"
        },
        {
          name: "perfil",
          description: "Papel RBAC do usuário interno. Domínio fechado: GERENTE ou ADMINISTRADOR (RNF10).",
          type: "VARCHAR(13)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Cadastro de Usuários Internos (RF08) | Destino: Controle de autorização RBAC da aplicação",
          rbac: "Leitura: Gerente, Administrador | Escrita: Administrador"
        },
        {
          name: "ativo",
          description: "Status operacional da conta interna: 1 = Ativo, 0 = Inativo. Usuário inativo não autentica (RF08).",
          type: "TINYINT",
          constraints: ["[NOT NULL]", "[DEFAULT 1]"],
          lgpd: "N/A",
          lineage: "Origem: Gestão de Usuários (RF08) | Destino: Middleware de autenticação",
          rbac: "Leitura: Administrador | Escrita: Administrador"
        }
      ]
    },
    {
      name: "cliente",
      domain: "Clientes & Conformidade LGPD",
      purpose: "Armazena os dados cadastrais dos compradores do e-commerce (Pessoa Física - consumidor final e Pessoa Jurídica - comerciante), aplicando criptografia AES-256, hash de unicidade e controles de consentimento e anonimização LGPD.",
      retention: "5 anos após último pedido (CTN PR01), seguido de anonimização irreversível (LGPD PR03)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_cliente",
          description: "Identificador único sequencial do cliente na plataforma.",
          type: "INT",
          constraints: ["[PK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "DP",
          lineage: "Origem: Autoatendimento Web / Admin (RF01) | Destino: endereco, pedido, log_auditoria, solicitacao_lgpd",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "nome_razao_social",
          description: "Nome completo (para PF) ou Razão Social (para PJ). Substituído por valor genérico na anonimização LGPD (RF11).",
          type: "VARCHAR(150)",
          constraints: ["[NOT NULL]"],
          lgpd: "DP",
          lineage: "Origem: Formulário de Cadastro (RF01) | Destino: Comprovante de pedido, exportação LGPD e relatórios",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "cpf_cnpj_cifrado",
          description: "Número do CPF ou CNPJ cifrado simetricamente em AES-256 (RNF09 / PR03) para proteção contra vazamentos.",
          type: "VARCHAR(255)",
          constraints: ["[NOT NULL]"],
          lgpd: "DPS",
          lineage: "Origem: Cadastro Cliente (cifrado na camada de segurança) | Destino: Emissão fiscal/comprovante e exportação LGPD",
          rbac: "Leitura: Cliente (próprio decifrado), Administrador | Escrita: Cliente (cadastro), Rotina Anonimização"
        },
        {
          name: "cpf_cnpj_hash",
          description: "Hash criptográfico determinístico SHA-256 (64 caracteres hexadecimais) do CPF/CNPJ para garantir unicidade sem expor o documento.",
          type: "CHAR(64)",
          constraints: ["[NOT NULL]", "[UNIQUE]"],
          lgpd: "DPS",
          lineage: "Origem: Derivado de CPF/CNPJ no cadastro (RF01) | Destino: Índice único de verificação de duplicidade",
          rbac: "Leitura: Serviço de Cadastro / Administrador | Escrita: Serviço de Cadastro / Rotina Anonimização"
        },
        {
          name: "tipo_cliente",
          description: "Classificação tributária/comercial do cliente: PF (Pessoa Física) ou PJ (Pessoa Jurídica). Determina acesso a itens exclusivos de atacado (RN07).",
          type: "VARCHAR(2)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Formulário de Cadastro (RF01) | Destino: Validação de regra de atacado exclusivo (RN07)",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (cadastro), Administrador"
        },
        {
          name: "email",
          description: "Endereço de correio eletrônico único utilizado para login e notificações de pedido.",
          type: "VARCHAR(150)",
          constraints: ["[NOT NULL]", "[UNIQUE]"],
          lgpd: "DP",
          lineage: "Origem: Formulário de Cadastro (RF01) | Destino: Autenticação, notificações e exportação LGPD",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "senha_hash",
          description: "Hash seguro da senha de acesso do cliente (Argon2id ou bcrypt). Nunca exibido nem exportado (RF11 / RNF09).",
          type: "VARCHAR(255)",
          constraints: ["[NOT NULL]"],
          lgpd: "DPS",
          lineage: "Origem: Cadastro / Redefinição de Senha | Destino: Validação de autenticação",
          rbac: "Leitura: Bloqueado para todos os perfis (somente serviço auth) | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "telefone",
          description: "Telefone principal de contato para suporte operacional e entrega.",
          type: "VARCHAR(20)",
          constraints: ["[NOT NULL]"],
          lgpd: "DP",
          lineage: "Origem: Formulário de Cadastro (RF01) | Destino: Logística de entrega e exportação LGPD",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "data_consentiment",
          description: "Carimbo de data/hora do aceite expresso do Termo de Consentimento LGPD no momento do cadastro (Art. 8º LGPD). Nota DDL: nomeado como data_consentiment.",
          type: "TIMESTAMP",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Aceite no Cadastro (RF01 / PR03) | Destino: Auditoria de conformidade LGPD",
          rbac: "Leitura: Cliente (próprio), Administrador | Escrita: Sistema (no ato do cadastro)"
        },
        {
          name: "data_anonimizacao",
          description: "Data e hora em que os dados pessoais do titular foram irreversivelmente anonimizados após cumprimento do prazo legal (RF11 / PR03).",
          type: "TIMESTAMP",
          constraints: ["[NULL]", "[DEFAULT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Rotina de Anonimização LGPD (RF11) | Destino: Trilha de conformidade DPO/LGPD",
          rbac: "Leitura: Administrador | Escrita: Administrador / Rotina LGPD"
        },
        {
          name: "ativo",
          description: "Indicador de conta ativa: 1 = Ativa, 0 = Inativa. Contas com histórico fiscal não são excluídas fisicamente (PR01).",
          type: "TINYINT",
          constraints: ["[NOT NULL]", "[DEFAULT 1]"],
          lgpd: "N/A",
          lineage: "Origem: Inativação de conta (RF01 / RF11) | Destino: Bloqueio de login e novos pedidos (RN10)",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (inativação), Administrador"
        }
      ]
    },
    {
      name: "loja",
      domain: "Unidades Físicas & Logística",
      purpose: "Cadastra as lojas físicas de atacarejo e os Centros de Distribuição (CD) do Assaí que mantêm saldo de estoque, atendem retiradas ou originam entregas.",
      retention: "Exclusão lógica (ativo = 0)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_loja",
          description: "Identificador único sequencial da loja ou centro de distribuição.",
          type: "INT",
          constraints: ["[PK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "N/A",
          lineage: "Origem: Gestão de Unidades (RF07) | Destino: estoque_loja.id_loja, pedido.id_loja",
          rbac: "Leitura: Todos os perfis | Escrita: Administrador"
        },
        {
          name: "nome",
          description: "Nome comercial ou identificação operacional da unidade (ex: Assaí Marginal Tietê, CD Anhanguera).",
          type: "VARCHAR(100)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Cadastro Administrativo (RF07) | Destino: Seleção de loja no site e comprovante de pedido",
          rbac: "Leitura: Todos os perfis | Escrita: Administrador"
        },
        {
          name: "tipo_unidade",
          description: "Classificação operacional da unidade: LOJA (loja de atendimento/retirada) ou CD (Centro de Distribuição).",
          type: "VARCHAR(5)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Cadastro Administrativo (RF07) | Destino: Regras logísticas de retirada e expedição",
          rbac: "Leitura: Todos os perfis | Escrita: Administrador"
        },
        {
          name: "logradouro",
          description: "Nome da via pública (avenida, rua, rodovia) onde a unidade está localizada.",
          type: "VARCHAR(150)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Cadastro Administrativo (RF07) | Destino: Exibição de endereço para retirada em loja",
          rbac: "Leitura: Todos os perfis | Escrita: Administrador"
        },
        {
          name: "numero",
          description: "Número predial ou quilômetro da unidade física.",
          type: "VARCHAR(10)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Cadastro Administrativo (RF07) | Destino: Endereço completo da unidade",
          rbac: "Leitura: Todos os perfis | Escrita: Administrador"
        },
        {
          name: "bairro",
          description: "Bairro ou distrito de localização da unidade.",
          type: "VARCHAR(80)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Cadastro Administrativo (RF07) | Destino: Endereço completo da unidade",
          rbac: "Leitura: Todos os perfis | Escrita: Administrador"
        },
        {
          name: "cep",
          description: "Código de Endereçamento Postal da unidade (8 dígitos numéricos sem hífen).",
          type: "CHAR(8)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Cadastro Administrativo (RF07) | Destino: Busca de lojas próximas ao cliente",
          rbac: "Leitura: Todos os perfis | Escrita: Administrador"
        },
        {
          name: "id_cidade",
          description: "Chave estrangeira que vincula a unidade ao município na tabela cidade.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: cidade.id_cidade | Destino: Filtro de lojas por município/UF",
          rbac: "Leitura: Todos os perfis | Escrita: Administrador"
        },
        {
          name: "ativo",
          description: "Status operacional da unidade: 1 = Ativa, 0 = Inativa. Unidade inativa não recebe novos pedidos (RN10).",
          type: "TINYINT",
          constraints: ["[NOT NULL]", "[DEFAULT 1]"],
          lgpd: "N/A",
          lineage: "Origem: Gestão de Unidades (RF07) | Destino: Validação de pedido (RN10)",
          rbac: "Leitura: Gerente, Administrador | Escrita: Administrador"
        }
      ]
    },
    {
      name: "endereco",
      domain: "Clientes & Logística",
      purpose: "Armazena os endereços de entrega e cobrança vinculados aos clientes cadastrados, suportando múltiplos locais por titular.",
      retention: "5 anos vinculado a pedidos (PR01), anonimizado sob demanda LGPD após prazo legal (RF11)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_endereco",
          description: "Identificador único sequencial do endereço cadastrado.",
          type: "INT",
          constraints: ["[PK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "DP",
          lineage: "Origem: Cadastro de Cliente (RF01) | Destino: pedido.id_endereco_entrega",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "id_cliente",
          description: "Chave estrangeira que identifica o cliente proprietário do endereço.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]"],
          lgpd: "DP",
          lineage: "Origem: cliente.id_cliente | Destino: Validação de propriedade do endereço no pedido (RN02)",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "logradouro",
          description: "Rua, avenida, praça ou alameda do endereço do cliente.",
          type: "VARCHAR(150)",
          constraints: ["[NOT NULL]"],
          lgpd: "DP",
          lineage: "Origem: Formulário de Endereço (RF01) | Destino: Expedição de entrega e exportação LGPD",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "numero",
          description: "Número do imóvel ou 'S/N'.",
          type: "VARCHAR(10)",
          constraints: ["[NOT NULL]"],
          lgpd: "DP",
          lineage: "Origem: Formulário de Endereço (RF01) | Destino: Expedição de entrega e exportação LGPD",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "complemento",
          description: "Informações adicionais de localização (apartamento, bloco, sala comercial, galpão).",
          type: "VARCHAR(60)",
          constraints: ["[NULL]"],
          lgpd: "DP",
          lineage: "Origem: Formulário de Endereço (RF01) | Destino: Expedição de entrega e exportação LGPD",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "bairro",
          description: "Bairro ou região administrativa do endereço.",
          type: "VARCHAR(80)",
          constraints: ["[NOT NULL]"],
          lgpd: "DP",
          lineage: "Origem: Formulário de Endereço (RF01) | Destino: Expedição de entrega",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "cep",
          description: "Código de Endereçamento Postal com 8 dígitos numéricos.",
          type: "CHAR(8)",
          constraints: ["[NOT NULL]"],
          lgpd: "DP",
          lineage: "Origem: Formulário de Endereço (RF01) | Destino: Validação de área de atendimento",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "id_cidade",
          description: "Chave estrangeira referenciando o município do endereço na tabela cidade.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: cidade.id_cidade | Destino: Composição completa do endereço",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "tipo_endereco",
          description: "Finalidade do endereço cadastrado: ENTREGA ou COBRANCA.",
          type: "VARCHAR(10)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Formulário de Endereço (RF01) | Destino: Seleção de endereço no checkout",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        },
        {
          name: "ativo",
          description: "Indicador de exclusão lógica do endereço: 1 = Ativo, 0 = Inativo.",
          type: "TINYINT",
          constraints: ["[NOT NULL]", "[DEFAULT 1]"],
          lgpd: "N/A",
          lineage: "Origem: Gestão de Endereços (RF01) | Destino: Preservação histórica de pedidos antigos",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (próprio), Administrador"
        }
      ]
    },
    {
      name: "produto",
      domain: "Catálogo & Precificação Atacarejo",
      purpose: "Contém o catálogo mestre de mercadorias comercializadas no site, definindo regras de preço de varejo, preço de atacado, quantidade mínima para gatilho de atacado e restrição para clientes PJ.",
      retention: "Exclusão lógica (ativo = 0)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_produto",
          description: "Identificador único sequencial (SKU interno) do produto no catálogo.",
          type: "INT",
          constraints: ["[PK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "N/A",
          lineage: "Origem: Gestão de Catálogo (RF02) | Destino: estoque_loja.id_produto, item_pedido.id_produto",
          rbac: "Leitura: Todos os perfis (ativos para Cliente) | Escrita: Gerente, Administrador"
        },
        {
          name: "id_categoria",
          description: "Chave estrangeira que classifica o produto em uma categoria mercadológica.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: categoria.id_categoria | Destino: Navegação e agrupamento no catálogo",
          rbac: "Leitura: Todos os perfis | Escrita: Gerente, Administrador"
        },
        {
          name: "descricao",
          description: "Nome comercial completo do produto, incluindo marca, peso/volume e embalagem.",
          type: "VARCHAR(200)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Cadastro de Produto (RF02) | Destino: Vitrine do e-commerce e comprovante de pedido",
          rbac: "Leitura: Todos os perfis | Escrita: Gerente, Administrador"
        },
        {
          name: "unidade_venda",
          description: "Unidade de comercialização do item. Domínio fechado: UNIDADE, CAIXA ou FARDO (RF02).",
          type: "VARCHAR(10)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Cadastro de Produto (RF02) | Destino: Exibição no carrinho e cálculo de volume",
          rbac: "Leitura: Todos os perfis | Escrita: Gerente, Administrador"
        },
        {
          name: "preco_varejo",
          description: "Preço unitário vigente para compras abaixo da quantidade mínima de atacado. Deve ser maior que zero.",
          type: "DECIMAL(12,2)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Tabela de Preços (RF02) | Destino: Cálculo dinâmico em item_pedido.preco_unitario_venda (RN06)",
          rbac: "Leitura: Todos os perfis | Escrita: Gerente, Administrador"
        },
        {
          name: "preco_atacado",
          description: "Preço unitário promocional vigente aplicado quando a quantidade atinge ou supera quantidade_minima_atacado. Deve ser > 0 e <= preco_varejo.",
          type: "DECIMAL(12,2)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Tabela de Preços (RF02) | Destino: Cálculo dinâmico em item_pedido.preco_unitario_venda (RN06)",
          rbac: "Leitura: Todos os perfis | Escrita: Gerente, Administrador"
        },
        {
          name: "quantidade_minima_atacado",
          description: "Quantidade mínima de unidades/caixas/fardos no mesmo item de pedido que dispara automaticamente o preço de atacado (RF06 / RN06).",
          type: "INT",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Política Comercial (RF02) | Destino: Gatilho de precificação em item_pedido (RN06)",
          rbac: "Leitura: Todos os perfis | Escrita: Gerente, Administrador"
        },
        {
          name: "exclusivo_atacado",
          description: "Flag booleana (0 = Não, 1 = Sim) que restringe a compra do produto exclusivamente a clientes Pessoa Jurídica (tipo_cliente = 'PJ') conforme RN07.",
          type: "TINYINT",
          constraints: ["[NOT NULL]", "[DEFAULT 0]"],
          lgpd: "N/A",
          lineage: "Origem: Regra Comercial Atacarejo (RF02) | Destino: Validação BEFORE INSERT em item_pedido (RN07)",
          rbac: "Leitura: Todos os perfis | Escrita: Gerente, Administrador"
        },
        {
          name: "ativo",
          description: "Indicador de disponibilidade para venda: 1 = Ativo, 0 = Inativo. Produtos inativos não entram em novos pedidos (RN10).",
          type: "TINYINT",
          constraints: ["[NOT NULL]", "[DEFAULT 1]"],
          lgpd: "N/A",
          lineage: "Origem: Gestão de Catálogo (RF02) | Destino: Filtro de vitrine e trava de item_pedido (RN10)",
          rbac: "Leitura: Gerente, Administrador | Escrita: Gerente, Administrador"
        }
      ]
    },
    {
      name: "estoque_loja",
      domain: "Controle de Estoque",
      purpose: "Entidade associativa que controla o saldo físico disponível de cada produto individualmente por loja ou centro de distribuição, impedindo vendas sem estoque.",
      retention: "Permanente (Atualizado transacionalmente)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_estoque_loja",
          description: "Identificador único sequencial do registro de posição de estoque (Loja x Produto).",
          type: "INT",
          constraints: ["[PK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "N/A",
          lineage: "Origem: Carga de Estoque / Cadastro (RF04) | Destino: ajuste_estoque.id_estoque_loja",
          rbac: "Leitura: Gerente, Administrador (disponibilidade consultada no checkout) | Escrita: Gerente, Administrador, Sistema"
        },
        {
          name: "id_loja",
          description: "Chave estrangeira que identifica a loja ou centro de distribuição detentor do saldo.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: loja.id_loja | Destino: Consulta de disponibilidade por unidade",
          rbac: "Leitura: Todos os perfis | Escrita: Administrador"
        },
        {
          name: "id_produto",
          description: "Chave estrangeira que identifica o produto estocado na unidade.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: produto.id_produto | Destino: Consulta de disponibilidade por SKU",
          rbac: "Leitura: Todos os perfis | Escrita: Administrador"
        },
        {
          name: "saldo_estoque",
          description: "Quantidade física disponível para venda na loja. Nunca pode ser negativa (>= 0); alterada exclusivamente por finalização de pedido (RN08), cancelamento (RF10) ou ajuste manual (RF04).",
          type: "INT",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Movimentações transacionais (RF03, RF04, RF10) | Destino: Trava de venda sem saldo (RN04)",
          rbac: "Leitura: Gerente, Administrador (validação booleana para Cliente) | Escrita: Gerente (via ajuste), Administrador, Triggers"
        }
      ]
    },
    {
      name: "ajuste_estoque",
      domain: "Controle de Estoque & Auditoria",
      purpose: "Registra o histórico auditável de todas as intervenções manuais de entrada ou saída de saldo realizadas por Gerentes ou Administradores (ex: avaria, inventário, reposição).",
      retention: "5 anos (Auditoria Operacional)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_ajuste_estoque",
          description: "Identificador único sequencial do lançamento de ajuste manual de estoque.",
          type: "INT",
          constraints: ["[PK]", "[FK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "N/A",
          lineage: "Origem: Módulo de Estoque (RF04) | Destino: log_auditoria (id_registro_afetado)",
          rbac: "Leitura: Gerente, Administrador | Escrita: Gerente, Administrador"
        },
        {
          name: "id_estoque_loja",
          description: "Identificador da posição de estoque (loja/produto) afetada pelo ajuste manual.",
          type: "INT",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: estoque_loja.id_estoque_loja | Destino: Atualização atômica de estoque_loja.saldo_estoque",
          rbac: "Leitura: Gerente, Administrador | Escrita: Gerente, Administrador"
        },
        {
          name: "id_usuario",
          description: "Chave estrangeira que identifica o colaborador interno responsável pela operação de ajuste.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]"],
          lgpd: "DP",
          lineage: "Origem: usuario.id_usuario (sessão autenticada) | Destino: Rastreabilidade de responsabilidade operacional",
          rbac: "Leitura: Gerente, Administrador | Escrita: Sistema (via sessão do usuário)"
        },
        {
          name: "quantidade_ajuste",
          description: "Quantidade positiva (acréscimo) ou negativa (baixa por perda/avaria) aplicada ao saldo. Deve ser diferente de zero.",
          type: "INT",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Formulário de Ajuste de Estoque (RF04) | Destino: Soma algébrica em estoque_loja.saldo_estoque",
          rbac: "Leitura: Gerente, Administrador | Escrita: Gerente, Administrador"
        },
        {
          name: "motivo",
          description: "Justificativa textual obrigatória para o ajuste manual (ex: 'Quebra no transporte', 'Contagem de inventário').",
          type: "VARCHAR(200)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Formulário de Ajuste de Estoque (RF04) | Destino: Relatórios de auditoria de perdas",
          rbac: "Leitura: Gerente, Administrador | Escrita: Gerente, Administrador"
        },
        {
          name: "data_hora",
          description: "Timestamp gerado automaticamente pelo servidor no momento do registro do ajuste.",
          type: "TIMESTAMP",
          constraints: ["[NOT NULL]", "[DEFAULT CURRENT_TIMESTAMP]"],
          lgpd: "N/A",
          lineage: "Origem: Relógio do Servidor SGBD | Destino: Linha do tempo de movimentação de estoque",
          rbac: "Leitura: Gerente, Administrador | Escrita: Sistema (automático)"
        }
      ]
    },
    {
      name: "pedido",
      domain: "Vendas & Pedidos",
      purpose: "Cabeçalho central das transações de compra realizadas no e-commerce, consolidando cliente, loja de atendimento, forma de pagamento, modalidade logística (entrega/retirada) e ciclo de vida.",
      retention: "5 anos obrigatórios (CTN Arts. 173 e 174 - PR01); exclusão física proibida",
      engine: "InnoDB",
      columns: [
        {
          name: "id_pedido",
          description: "Número único sequencial identificador do pedido de compra.",
          type: "INT",
          constraints: ["[PK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "N/A",
          lineage: "Origem: Checkout Web (RF03) | Destino: item_pedido.id_pedido, estorno.id_pedido, comprovante do cliente",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (criação/cancelamento), Sistema"
        },
        {
          name: "id_cliente",
          description: "Chave estrangeira obrigatória vinculando o pedido ao cliente comprador.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]"],
          lgpd: "DP",
          lineage: "Origem: cliente.id_cliente | Destino: Histórico de compras do cliente (RF05)",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Sistema (sessão do cliente)"
        },
        {
          name: "id_loja",
          description: "Chave estrangeira obrigatória identificando a loja de retirada ou unidade de origem da entrega.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: loja.id_loja | Destino: Baixa/reposição de estoque na loja correspondente (RN08)",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (no checkout)"
        },
        {
          name: "id_forma_pagamento",
          description: "Chave estrangeira obrigatória registrando o meio de pagamento escolhido pelo cliente.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: forma_pagamento.id_forma_pagamento | Destino: Comprovante de pedido e conciliação",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (no checkout)"
        },
        {
          name: "id_endereco_entrega",
          description: "Chave estrangeira para endereco. Obrigatória quando tipo_entrega = 'ENTREGA' e obrigatoriamente NULL quando tipo_entrega = 'RETIRADA' (RN02).",
          type: "INT",
          constraints: ["[FK]", "[NULL]"],
          lgpd: "DP",
          lineage: "Origem: endereco.id_endereco | Destino: Romaneio de entrega domiciliar",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (no checkout)"
        },
        {
          name: "data_hora",
          description: "Data e hora exatas de emissão do pedido gravadas pelo servidor. Marco inicial para contagem de retenção fiscal de 5 anos (PR01).",
          type: "TIMESTAMP",
          constraints: ["[NOT NULL]", "[DEFAULT CURRENT_TIMESTAMP]"],
          lgpd: "N/A",
          lineage: "Origem: Relógio do Servidor SGBD | Destino: Filtros de histórico (RF05) e retenção fiscal (PR01)",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Sistema (automático)"
        },
        {
          name: "situacao",
          description: "Estado atual do pedido no fluxo operacional: ABERTO, FINALIZADO ou CANCELADO (RN01 / RN09).",
          type: "VARCHAR(10)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Máquina de estados do pedido (RF03, RF10) | Destino: Gatilhos de estoque (RN08) e imutabilidade (RN09)",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (cancelamento), Sistema (finalização)"
        },
        {
          name: "tipo_entrega",
          description: "Modalidade logística selecionada: ENTREGA (no endereço do cliente) ou RETIRADA (na loja escolhida).",
          type: "VARCHAR(8)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Checkout Web (RF03) | Destino: Validação de endereço obrigatório (RN02)",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (no checkout)"
        },
        {
          name: "valor_desconto",
          description: "Valor monetário total de desconto concedido no pedido (padrão 0.00). Não pode ser negativo nem exceder o valor bruto (RN05).",
          type: "DECIMAL(12,2)",
          constraints: ["[NOT NULL]", "[DEFAULT 0]"],
          lgpd: "N/A",
          lineage: "Origem: Checkout / Cupom Comercial (RF03) | Destino: Cálculo do valor líquido na visão vw_pedido_total",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Sistema / Checkout"
        },
        {
          name: "data_recebimento",
          description: "Data efetiva em que o cliente recebeu ou retirou a mercadoria. Marco inicial do prazo legal de 7 dias corridos para arrependimento (CDC Art. 49 / PR02).",
          type: "DATE",
          constraints: ["[NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Confirmação operacional pelo Gerente/Admin (RF10) | Destino: Validação do prazo de 7 dias para cancelamento (PR02)",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Gerente, Administrador"
        },
        {
          name: "data_cancelamento",
          description: "Data em que o pedido foi cancelado pelo cliente ou operação. Bloqueada se ultrapassar 7 dias corridos de data_recebimento (PR02).",
          type: "DATE",
          constraints: ["[NULL]", "[DEFAULT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Solicitação de cancelamento (RF10) | Destino: Disparo de estorno e reposição de estoque (RN08)",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (dentro do prazo), Administrador"
        }
      ]
    },
    {
      name: "item_pedido",
      domain: "Vendas & Pedidos",
      purpose: "Detalha os produtos, quantidades e preços unitários congelados pertencentes a cada pedido, resolvendo o relacionamento N:N entre pedido e produto.",
      retention: "5 anos obrigatórios (CTN PR01); registros imutáveis após encerramento do pedido (RN09)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_item_pedido",
          description: "Identificador único sequencial da linha de item dentro de um pedido.",
          type: "INT",
          constraints: ["[PK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "N/A",
          lineage: "Origem: Carrinho / Checkout (RF03) | Destino: Comprovante detalhado do pedido",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (enquanto pedido ABERTO)"
        },
        {
          name: "id_pedido",
          description: "Chave estrangeira que associa o item ao cabeçalho do pedido.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: pedido.id_pedido | Destino: Agrupamento de itens e totalização em vw_pedido_total",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (enquanto pedido ABERTO)"
        },
        {
          name: "id_produto",
          description: "Chave estrangeira que identifica o produto adquirido.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: produto.id_produto | Destino: Consulta de regras de atacado e baixa de estoque",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (enquanto pedido ABERTO)"
        },
        {
          name: "quantidade",
          description: "Quantidade de unidades/caixas/fardos solicitada do produto. Deve ser maior que zero e menor ou igual ao saldo da loja (RN04).",
          type: "INT",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Carrinho de Compras (RF03) | Destino: Gatilho de preço atacado (RN06) e baixa de estoque (RN08)",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Cliente (enquanto pedido ABERTO)"
        },
        {
          name: "preco_unitario_venda",
          description: "Preço unitário efetivamente praticado e congelado no ato da venda (atacado se quantidade >= quantidade_minima_atacado, senão varejo). Imune a reajustes futuros do catálogo (RN03 / RN06).",
          type: "DECIMAL(12,2)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Derivado de produto.preco_atacado ou produto.preco_varejo (RN06) | Destino: Cálculo financeiro histórico do pedido (RN03)",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Sistema / Trigger (nunca editável manualmente)"
        }
      ]
    },
    {
      name: "estorno",
      domain: "Financeiro & Pós-Venda (CDC)",
      purpose: "Controla a solicitação e a conclusão do reembolso integral devido ao cliente em decorrência do cancelamento de um pedido (CDC Art. 49 / PR02).",
      retention: "5 anos obrigatórios (CTN PR01)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_estorno",
          description: "Identificador único sequencial do registro de estorno financeiro.",
          type: "INT",
          constraints: ["[PK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "N/A",
          lineage: "Origem: Fluxo de Cancelamento (RF10) | Destino: Relatórios financeiros e auditoria",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Sistema / Gerente / Administrador"
        },
        {
          name: "id_pedido",
          description: "Chave estrangeira única (relacionamento 1:1) vinculando o estorno ao pedido cancelado.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]", "[UNIQUE]"],
          lgpd: "N/A",
          lineage: "Origem: pedido.id_pedido | Destino: Garantia de estorno único por pedido cancelado",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Sistema (no cancelamento)"
        },
        {
          name: "id_usuario",
          description: "Chave estrangeira do colaborador (Gerente/Admin) que validou e concluiu o estorno. Permanece NULL enquanto situacao = 'SOLICITADO'.",
          type: "INT",
          constraints: ["[FK]", "[NULL]"],
          lgpd: "DP",
          lineage: "Origem: usuario.id_usuario | Destino: Rastreabilidade de aprovação financeira",
          rbac: "Leitura: Gerente, Administrador | Escrita: Gerente, Administrador"
        },
        {
          name: "data_solicitacao",
          description: "Data e hora em que o cancelamento foi efetivado e o estorno foi gerado automaticamente.",
          type: "TIMESTAMP",
          constraints: ["[NOT NULL]", "[DEFAULT CURRENT_TIMESTAMP]"],
          lgpd: "N/A",
          lineage: "Origem: Relógio do Servidor SGBD (RF10) | Destino: SLA de atendimento de reembolso",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Sistema (automático)"
        },
        {
          name: "data_conclusao",
          description: "Data e hora em que o reembolso foi efetivamente concluído pela equipe administrativa.",
          type: "TIMESTAMP",
          constraints: ["[NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Baixa administrativa de estorno (RF10) | Destino: Comprovante de reembolso ao cliente",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Gerente, Administrador"
        },
        {
          name: "valor_estorno",
          description: "Valor monetário integral a ser devolvido ao cliente, correspondente ao valor líquido total do pedido cancelado (PR02).",
          type: "DECIMAL(12,2)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Total líquido do pedido cancelado | Destino: Conciliação financeira",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Sistema (no cancelamento)"
        },
        {
          name: "situacao",
          description: "Estado do processamento do reembolso: SOLICITADO ou CONCLUIDO.",
          type: "VARCHAR(10)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Fluxo de Estorno (RF10) | Destino: Acompanhamento pelo cliente e gerência",
          rbac: "Leitura: Cliente (próprio), Gerente, Administrador | Escrita: Gerente, Administrador"
        }
      ]
    },
    {
      name: "log_auditoria",
      domain: "Segurança, Auditoria & Marco Civil",
      purpose: "Trilha de auditoria imutável (append-only) que registra operações de inclusão, alteração, exclusão lógica e eventos de autenticação (login/IP), sem armazenar dados pessoais em texto claro.",
      retention: "Mínimo 6 meses para logs de acesso (Marco Civil Art. 15 - PR04) e 5 anos para eventos fiscais (CTN PR01)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_log",
          description: "Identificador único sequencial de alta capacidade (BIGINT) do evento de auditoria.",
          type: "BIGINT",
          constraints: ["[PK]", "[NOT NULL]", "[AUTO_INCREMENT]"],
          lgpd: "N/A",
          lineage: "Origem: Triggers de auditoria e serviço de autenticação (RNF01) | Destino: Consultas de auditoria interna",
          rbac: "Leitura: Administrador (somente leitura) | Escrita: Triggers / Sistema (UPDATE e DELETE revogados - RNF11)"
        },
        {
          name: "id_usuario",
          description: "Chave estrangeira do usuário interno autor da ação. NULL quando a ação foi executada por um cliente.",
          type: "INT",
          constraints: ["[FK]", "[NULL]"],
          lgpd: "DP",
          lineage: "Origem: usuario.id_usuario | Destino: Rastreabilidade de ações administrativas",
          rbac: "Leitura: Administrador | Escrita: Sistema / Triggers"
        },
        {
          name: "id_cliente",
          description: "Chave estrangeira do cliente autor da ação. NULL quando a ação foi executada por um usuário interno.",
          type: "INT",
          constraints: ["[FK]", "[NULL]"],
          lgpd: "DP",
          lineage: "Origem: cliente.id_cliente | Destino: Rastreabilidade de ações do titular",
          rbac: "Leitura: Administrador | Escrita: Sistema / Triggers"
        },
        {
          name: "tabela_afetada",
          description: "Nome da tabela do banco de dados que sofreu a operação auditada (ou 'autenticacao' em eventos de login).",
          type: "VARCHAR(50)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Metadado da Trigger / Sistema (RNF01) | Destino: Filtro de investigação de auditoria",
          rbac: "Leitura: Administrador | Escrita: Sistema / Triggers"
        },
        {
          name: "id_registro_afetado",
          description: "Valor da chave primária do registro inserido, alterado ou inativado.",
          type: "INT",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: PK do registro manipulado (RNF01) | Destino: Correlação com a entidade auditada",
          rbac: "Leitura: Administrador | Escrita: Sistema / Triggers"
        },
        {
          name: "operacao",
          description: "Tipo de evento registrado: INSERT, UPDATE, EXCLUSAO LOGICA ou LOGIN (RNF01 / PR04).",
          type: "VARCHAR(10)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Trigger / Middleware Auth | Destino: Classificação de eventos de segurança",
          rbac: "Leitura: Administrador | Escrita: Sistema / Triggers"
        },
        {
          name: "data_hora",
          description: "Data e hora exatas da ocorrência do evento gravadas pelo servidor.",
          type: "TIMESTAMP",
          constraints: ["[NOT NULL]", "[DEFAULT CURRENT_TIMESTAMP]"],
          lgpd: "N/A",
          lineage: "Origem: Relógio do Servidor SGBD | Destino: Cronologia forense e cumprimento do Marco Civil (PR04)",
          rbac: "Leitura: Administrador | Escrita: Sistema (automático)"
        },
        {
          name: "valor_anterior",
          description: "Estado serializado dos atributos antes da alteração (mascarado/sem dados pessoais em texto claro conforme PR03).",
          type: "TEXT",
          constraints: ["[NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Registro OLD na Trigger (RNF01) | Destino: Comparativo de integridade",
          rbac: "Leitura: Administrador | Escrita: Sistema / Triggers"
        },
        {
          name: "valor_novo",
          description: "Estado serializado dos atributos após a inclusão ou alteração (mascarado/sem dados pessoais em texto claro conforme PR03).",
          type: "TEXT",
          constraints: ["[NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Registro NEW na Trigger (RNF01) | Destino: Comparativo de integridade",
          rbac: "Leitura: Administrador | Escrita: Sistema / Triggers"
        },
        {
          name: "endereco_ip",
          description: "Endereço IP de origem (IPv4 ou IPv6, até 45 chars) da conexão, obrigatório para guarda de registros de acesso por 6 meses (Marco Civil Art. 15 / PR04).",
          type: "VARCHAR(45)",
          constraints: ["[NULL]"],
          lgpd: "DP",
          lineage: "Origem: Cabeçalho de rede da requisição TLS 1.3 | Destino: Conformidade Marco Civil da Internet (PR04)",
          rbac: "Leitura: Administrador | Escrita: Sistema / Aplicação"
        }
      ]
    },
    {
      name: "solicitacao_lgpd",
      domain: "Privacidade & Direitos do Titular (LGPD)",
      purpose: "Gerencia e rastreia as solicitações formais dos titulares de dados para portabilidade/exportação (JSON/CSV) ou anonimização/eliminação de dados pessoais (LGPD Art. 18 / RF11).",
      retention: "5 anos (Comprovação de atendimento ao titular perante a ANPD)",
      engine: "InnoDB",
      columns: [
        {
          name: "id_solicitacao_lgpd",
          description: "Identificador único do protocolo de atendimento LGPD.",
          type: "INT",
          constraints: ["[PK]", "[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Portal de Privacidade do Cliente (RF11) | Destino: Protocolo de acompanhamento do titular",
          rbac: "Leitura: Cliente (próprio), Administrador | Escrita: Cliente (abertura), Administrador"
        },
        {
          name: "id_cliente",
          description: "Chave estrangeira identificando o cliente titular dos dados que originou a requisição.",
          type: "INT",
          constraints: ["[FK]", "[NOT NULL]"],
          lgpd: "DP",
          lineage: "Origem: cliente.id_cliente | Destino: Vinculação ao titular e verificação de retenção fiscal de 5 anos",
          rbac: "Leitura: Cliente (próprio), Administrador | Escrita: Sistema (sessão do cliente)"
        },
        {
          name: "tipo_solicitacao",
          description: "Natureza do direito exercido pelo titular conforme Art. 18 da LGPD (ex: EXPORTACAO_DADOS, ANONIMIZACAO).",
          type: "VARCHAR(30)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Formulário LGPD do Cliente (RF11) | Destino: Fluxo de atendimento do DPO/Administrador",
          rbac: "Leitura: Cliente (próprio), Administrador | Escrita: Cliente (abertura)"
        },
        {
          name: "data_solicitacao",
          description: "Data e hora da abertura do pedido pelo titular. Inicia o prazo legal de 15 dias corridos para resposta (RF11 / LGPD Art. 19).",
          type: "TIMESTAMP",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Relógio do Servidor SGBD | Destino: Controle de SLA legal de 15 dias",
          rbac: "Leitura: Cliente (próprio), Administrador | Escrita: Sistema (automático)"
        },
        {
          name: "situacao",
          description: "Status atual do atendimento da requisição LGPD (ex: PENDENTE, AGUARDANDO_PRAZO_FISCAL, CONCLUIDA).",
          type: "VARCHAR(30)",
          constraints: ["[NOT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Gestão de Privacidade (RF11) | Destino: Painel de transparência do titular",
          rbac: "Leitura: Cliente (próprio), Administrador | Escrita: Administrador"
        },
        {
          name: "data_conclusao",
          description: "Data e hora em que a exportação foi disponibilizada ou a anonimização irreversível foi concluída.",
          type: "TIMESTAMP",
          constraints: ["[NULL]", "[DEFAULT NULL]"],
          lgpd: "N/A",
          lineage: "Origem: Execução administrativa (RF11) | Destino: Evidência de cumprimento regulatório LGPD",
          rbac: "Leitura: Cliente (próprio), Administrador | Escrita: Administrador"
        }
      ]
    }
  ];
  
  // Referências DOM
  const sidebarNavList = document.getElementById("sidebarNavList");
  const dictionaryContainer = document.getElementById("dictionaryContainer");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const searchStatus = document.getElementById("searchStatus");
  const kpiTables = document.getElementById("kpiTables");
  const kpiColumns = document.getElementById("kpiColumns");
  const kpiPII = document.getElementById("kpiPII");
  
  // Renderização Inicial do Dicionário e Sidebar
  function renderDictionary() {
    let totalColumns = 0;
    let totalPII = 0;
  
    sidebarNavList.innerHTML = "";
    dictionaryContainer.innerHTML = "";
  
    SCHEMA_TABLES.forEach((table) => {
      totalColumns += table.columns.length;
      const tablePIICount = table.columns.filter(c => c.lgpd === "DP" || c.lgpd === "DPS").length;
      totalPII += tablePIICount;
  
      // 1. Item na Sidebar
      const navLi = document.createElement("li");
      navLi.innerHTML = `
        <a href="#table_${table.name}" class="nav-link" data-nav-table="${table.name}">
          <span>${table.name}</span>
          <span class="col-count">${table.columns.length}</span>
        </a>
      `;
      sidebarNavList.appendChild(navLi);
  
      // 2. Seção da Tabela na Área Principal
      const section = document.createElement("section");
      section.className = "table-section";
      section.id = `table_${table.name}`;
      section.setAttribute("data-table-name", table.name.toLowerCase());
  
      const rowsHtml = table.columns.map((col) => {
        const constraintsHtml = col.constraints.map((c) => {
          let extraClass = "";
          if (c === "[PK]") extraClass = "constraint-pk";
          else if (c === "[FK]") extraClass = "constraint-fk";
          else if (c === "[UNIQUE]") extraClass = "constraint-uk";
          return `<span class="constraint-tag ${extraClass}">${c}</span>`;
        }).join(" ");
  
        let lgpdBadge = "";
        if (col.lgpd === "DPS") {
          lgpdBadge = `<span class="badge-lgpd badge-dps">[DPS]</span>`;
        } else if (col.lgpd === "DP") {
          lgpdBadge = `<span class="badge-lgpd badge-dp">[DP]</span>`;
        } else {
          lgpdBadge = `<span class="badge-lgpd badge-na">[N/A]</span>`;
        }
  
        const rowSearchData = `${table.name} ${col.name} ${col.description} ${col.type} ${col.constraints.join(" ")} ${col.lgpd} ${col.lineage} ${col.rbac}`.toLowerCase();
  
        return `
          <tr data-search="${escapeHtml(rowSearchData)}">
            <td class="col-attr">${col.name}</td>
            <td class="desc-text">${col.description}</td>
            <td class="col-type"><code>${col.type}</code></td>
            <td>${constraintsHtml}</td>
            <td>${lgpdBadge}</td>
            <td class="lineage-text">${col.lineage}</td>
            <td class="rbac-text">${col.rbac}</td>
          </tr>
        `;
      }).join("");
  
      section.innerHTML = `
        <div class="table-section-header">
          <div>
            <div class="table-title-row">
              <h3>${table.name}</h3>
              <span class="domain-chip">${table.domain}</span>
            </div>
            <p class="table-purpose">${table.purpose}</p>
          </div>
          <div class="table-meta-tags">
            <span class="meta-pill"><i class="fa-solid fa-table-columns"></i> ${table.columns.length} colunas</span>
            <span class="meta-pill"><i class="fa-solid fa-clock-rotate-left"></i> ${table.retention}</span>
          </div>
        </div>
        <div class="table-responsive">
          <table class="dict-table">
            <thead>
              <tr>
                <th>Atributo</th>
                <th>Descrição / Regra de Negócio</th>
                <th>Tipo e Tamanho</th>
                <th>Constraints</th>
                <th>Privacidade (LGPD/GDPR)</th>
                <th>Linhagem (Data Lineage)</th>
                <th>Controle de Acesso (RBAC)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      `;
  
      dictionaryContainer.appendChild(section);
    });
  
    kpiTables.textContent = SCHEMA_TABLES.length;
    kpiColumns.textContent = totalColumns;
    kpiPII.textContent = totalPII;
  }
  
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  
  // Pesquisa em Tempo Real
  function filterDictionary(query) {
    const term = query.trim().toLowerCase();
    clearSearchBtn.classList.toggle("hidden", term.length === 0);
  
    const sections = document.querySelectorAll(".table-section");
    const navLinks = document.querySelectorAll(".nav-link");
    let visibleTables = 0;
    let visibleRows = 0;
  
    sections.forEach((section) => {
      const tableName = section.getAttribute("data-table-name");
      const rows = section.querySelectorAll("tbody tr");
      const tableMatchesDirectly = term.length > 0 && tableName.includes(term);
      let tableVisibleRowCount = 0;
  
      rows.forEach((row) => {
        const rowData = row.getAttribute("data-search");
        const match = term.length === 0 || tableMatchesDirectly || rowData.includes(term);
        row.classList.toggle("hidden-row", !match);
        if (match) {
          tableVisibleRowCount++;
          visibleRows++;
        }
      });
  
      const showSection = tableVisibleRowCount > 0;
      section.classList.toggle("hidden-section", !showSection);
      if (showSection) visibleTables++;
  
      // Sincroniza visibilidade na sidebar
      const rawName = section.id.replace("table_", "");
      navLinks.forEach((link) => {
        if (link.getAttribute("data-nav-table") === rawName) {
          link.parentElement.style.display = showSection ? "block" : "none";
        }
      });
    });
  
    if (term.length === 0) {
      searchStatus.textContent = "";
    } else {
      searchStatus.textContent = `Exibindo ${visibleRows} atributo(s) em ${visibleTables} tabela(s) para o filtro "${query}".`;
    }
  }
  
  searchInput.addEventListener("input", (e) => filterDictionary(e.target.value));
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    filterDictionary("");
    searchInput.focus();
  });
  
  // Toggle Light / Dark Mode
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");
  
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("assai_dict_theme", theme);
    if (theme === "dark") {
      themeIcon.className = "fa-solid fa-sun";
      themeText.textContent = "Modo Claro";
    } else {
      themeIcon.className = "fa-solid fa-moon";
      themeText.textContent = "Modo Escuro";
    }
  }
  
  const savedTheme = localStorage.getItem("assai_dict_theme") || "light";
  applyTheme(savedTheme);
  
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });
  
  // Sidebar Responsiva Mobile
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarClose = document.getElementById("sidebarClose");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  
  function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("active");
  }
  
  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("active");
  }
  
  sidebarToggle.addEventListener("click", openSidebar);
  sidebarClose.addEventListener("click", closeSidebar);
  sidebarOverlay.addEventListener("click", closeSidebar);
  sidebarNavList.addEventListener("click", (e) => {
    if (e.target.closest(".nav-link") && window.innerWidth <= 768) {
      closeSidebar();
    }
  });
  
  // Modal do DER com Panzoom.js
  const derModal = document.getElementById("derModal");
  const openDerModalBtn = document.getElementById("openDerModalBtn");
  const closeDerModalBtn = document.getElementById("closeDerModalBtn");
  const derModalBackdrop = document.getElementById("derModalBackdrop");
  const panzoomContainer = document.getElementById("panzoomContainer");
  const panzoomWrapper = document.getElementById("panzoomWrapper");
  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");
  const zoomResetBtn = document.getElementById("zoomResetBtn");
  
  let panzoomInstance = null;
  
  function initPanzoom() {
    if (!panzoomInstance && typeof Panzoom !== "undefined") {
      panzoomInstance = Panzoom(panzoomContainer, {
        maxScale: 6,
        minScale: 0.4,
        step: 0.25,
        contain: "outside"
      });
      panzoomWrapper.addEventListener("wheel", panzoomInstance.zoomWithWheel, { passive: false });
    }
  }
  
  function openDerModal() {
    derModal.hidden = false;
    document.body.style.overflow = "hidden";
    initPanzoom();
    if (panzoomInstance) {
      panzoomInstance.reset();
    }
  }
  
  function closeDerModal() {
    derModal.hidden = true;
    document.body.style.overflow = "";
  }
  
  openDerModalBtn.addEventListener("click", openDerModal);
  closeDerModalBtn.addEventListener("click", closeDerModal);
  derModalBackdrop.addEventListener("click", closeDerModal);
  
  zoomInBtn.addEventListener("click", () => {
    if (panzoomInstance) panzoomInstance.zoomIn();
  });
  
  zoomOutBtn.addEventListener("click", () => {
    if (panzoomInstance) panzoomInstance.zoomOut();
  });
  
  zoomResetBtn.addEventListener("click", () => {
    if (panzoomInstance) panzoomInstance.reset();
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !derModal.hidden) {
      closeDerModal();
    }
  });
  
  // Inicializa aplicação
  renderDictionary();