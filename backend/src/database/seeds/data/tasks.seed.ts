import { TaskPriority, TaskStatus } from '../../../tasks/task.entity';

export interface SeedTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  userId: string;
}

export const seedTasks: SeedTask[] = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'Preparar café da manhã especial',
    description:
      'Fazer aquele café caprichado com pão na chapa, ovos mexidos e uma vitamina de banana. Aproveitar para colocar uma música boa e começar o dia com energia!',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.HIGH,
    dueDate: new Date('2025-10-20'),
    userId: '11111111-1111-1111-1111-111111111111', // Maria
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    title: 'Organizar a estante de livros',
    description:
      'Separar os livros por categoria, colocar em ordem alfabética e aproveitar para redescobrir aqueles títulos esquecidos. Quem sabe não surge uma boa releitura?',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.LOW,
    userId: '11111111-1111-1111-1111-111111111111', // Maria
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    title: 'Aprender receita de brigadeiro gourmet',
    description:
      'Pesquisar no YouTube aquelas receitas incríveis, comprar os ingredientes e testar diferentes sabores. Chocolate meio amargo, leite ninho, maracujá... as possibilidades são infinitas!',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date('2025-10-28'),
    userId: '22222222-2222-2222-2222-222222222222', // João
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    title: 'Planejar fim de semana na praia',
    description:
      'Escolher a praia, verificar a previsão do tempo, preparar a mochila com protetor solar, canga, e claro, uma boa playlist para curtir o mar!',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date('2025-11-05'),
    userId: '22222222-2222-2222-2222-222222222222', // João
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    title: 'Assistir aquela série que todo mundo fala',
    description:
      'Finalmente separar um tempo para maratonar aquela série que está na lista há meses. Preparar a pipoca, escolher o sofá mais confortável e desligar o celular!',
    status: TaskStatus.PENDING,
    priority: TaskPriority.LOW,
    dueDate: new Date('2025-11-10'),
    userId: '11111111-1111-1111-1111-111111111111', // Maria
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    title: 'Criar playlist para academia',
    description:
      'Montar uma playlist épica com aquelas músicas que dão energia total. Misturar funk, eletrônica, rock... tudo que faz querer correr mais rápido na esteira!',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.LOW,
    userId: '22222222-2222-2222-2222-222222222222', // João
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    title: 'Ligar para a vó e contar as novidades',
    description:
      'Fazer aquela ligação especial para colocar a conversa em dia, contar sobre o trabalho, perguntar das receitas dela e combinar uma visita no próximo fim de semana.',
    status: TaskStatus.PENDING,
    priority: TaskPriority.HIGH,
    dueDate: new Date('2025-11-15'),
    userId: '11111111-1111-1111-1111-111111111111', // Maria
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    title: 'Experimentar aquele restaurante novo',
    description:
      'Conhecer o restaurante que abriu no bairro e que todo mundo está comentando. Chamar uns amigos, reservar uma mesa e experimentar os pratos mais recomendados.',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date('2025-11-20'),
    userId: '22222222-2222-2222-2222-222222222222', // João
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    title: 'Organizar o armário de roupas',
    description:
      'Fazer aquela faxina no guarda-roupa, separar peças que não usa mais para doação e redescobrir aquelas roupas esquecidas no fundo do armário.',
    status: TaskStatus.PENDING,
    priority: TaskPriority.LOW,
    dueDate: new Date('2025-11-12'),
    userId: '11111111-1111-1111-1111-111111111111', // Maria
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    title: 'Aprender a tocar violão',
    description:
      'Começar as aulas de violão, treinar os primeiros acordes e tentar tocar aquela música especial. Quem sabe não rola uma serenata no futuro?',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date('2025-12-01'),
    userId: '22222222-2222-2222-2222-222222222222', // João
  },
];
