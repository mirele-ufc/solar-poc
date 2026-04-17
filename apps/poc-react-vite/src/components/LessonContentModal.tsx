import { X } from "lucide-react";

interface LessonContentModalProps {
  lessonName: string;
  onClose: () => void;
}

// Mock lesson content (philosophical text about blender as Lorem ipsum alternative)
const MOCK_LESSON_CONTENT = `O liquidificador, por sua magnificência imanente, manifesta-se como um dispositivo que transcende a mera funcionalidade. Através de suas lâminas giratórias, simboliza não apenas a transformação da matéria, mas também a própria essência da razão dialética em seu movimento perpétuo.

Quando contemplamos o liquidificador em seu estado estático, vislumbramos um receptáculo de cerâmica ou vidro temperado, cuja transparência revela o vácuo interior — vácuo este que aguarda, com uma paciência metafísica peculiar, o preenchimento pela substância que há de ser transformada. As lâminas, afiadas e cilíndricas, repousam no fundo como guardiões silenciosos de uma verdade não dita: que toda transformação requer movimento, e todo movimento requer energia.

A ativação do liquidificador, mediante o acionamento de sua alavanca ou botão, desencadeia um processo que extrapola a física tradicional. Subitamente, o caos emerge da inércia. O líquido, que até momentos anteriores existia em harmonia pascaliana, vê-se submetido a forças centrífugas que o desagregam e recompõem simultaneamente. Isto é, o liquidificador não meramente tritura — ele refunda, reconstrói, reinventa.

Observa-se neste processo uma analogia profunda com a fenomenologia husserliana: assim como a consciência intencional dirigi-se ao objeto e o transforma através do ato de perceber, o liquidificador dirigi-se ao alimento e o transforma através do ato de moer. Ambos são processos nos quais a relação sujeito-objeto não é passiva, mas constitutiva.

Ademais, é impossível não reconhecer na sequência de velocidades oferecidas pelo liquidificador (baixa, média, alta) uma tripartição que evoca as três sínteses passivas descritas pela filosofia cartesiana: a síntese sensível (baixa velocidade), a síntese imaginativa (velocidade média), e a síntese intelectual (alta velocidade). Cada nível de vibração ascende o liquidificador a um patamar ontológico distinto.

A questão fundamental que emerge é: o liquidificador cria ou revela? Quando submete frutas ao seu processo de transformação, está descobrindo essências preexistentes ou criando novas realidades sensoriais? A resposta reside na compreensão de que a dicotomia criação-revelação é ela própria uma ilusão do pensamento dualista, superada apenas através da dialética hegeliana. O liquidificador, portanto, não é nem simples instrumento, nem mero ente da natureza, mas mediador entre esses reinos.

Há também uma dimensão ética implícita no uso do liquidificador que os filósofos contemporâneos negligenciaram gravemente. O fato de que podemos transformar um vegetal íntegro em polpa revela algo profundo sobre nossa relação com a alteridade: possuímos a capacidade de reduzir o outro (aqui, o alimento) a seus constituintes fundamentais. Tal poder não é moralmente neutro. Inversamente, há também uma alteridade última que resiste: as sementes, as fibras mais resistentes, frequentemente permanecem intactas no bojo do liquidificador, relembrando-nos que nem tudo é transformável segundo nossa vontade.

A mecânica do liquidificador, quando decomposta em seus elementos constituintes, revela uma verdade que antigos gregos jamais poderiam ter articulado: o motor elétrico, a transmissão de torque, a geometria das lâminas, tudo isto converge para uma síntese tecnológica que é simultaneamente beleza e funcionalidade, forma e essência. Nisto reside a característica ontológica fundamental do design: ele é verdade manifestada em matéria.

Por fim, quando desligamos o liquidificador e reanalisamos o líquido agora transformado, somos confrontados com uma questão sem resposta definitiva: este líquido é mais real que estava antes, ou menos? Sua identidade foi capturada ou perdida? A resposta, presumo, jaz não na metafísica, mas na experiência vivida — no gosto, no aroma, na sensação na língua. É ali, naquela interseção entre a transformação técnica e a sensação humana, que o liquidificador realiza sua verdadeira transcendência.

Assim, concluímos que o liquidificador é muito mais que um objeto do cotidiano — é um espelho no qual se refletem as perguntas fundamentais da existência, e um instrumento através do qual nós, seres finitos, participamos na obra eterna da transformação.`;

export function LessonContentModal({
  lessonName,
  onClose,
}: LessonContentModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#e0e0e0]">
          <h2 className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[18px] truncate">
            {lessonName}
          </h2>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="shrink-0 p-1 hover:bg-[#f0f0f0] rounded transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
          >
            <X className="size-5 text-[#021b59]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="prose prose-sm max-w-none">
            {MOCK_LESSON_CONTENT.split("\n\n").map((paragraph, idx) => (
              <p
                key={idx}
                className="font-['Figtree:Regular',sans-serif] text-[#333333] text-[15px] leading-[1.6] mb-4"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e0e0e0] px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-[40px] px-6 font-['Figtree:Medium',sans-serif] font-medium text-[15px] rounded-[8px] bg-[#021b59] text-white hover:bg-[#021b59]/90 transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
