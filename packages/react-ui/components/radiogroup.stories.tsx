export default {
  title: '😌 TestRetreat ',
};

interface Option {
  id: string;
  value: string;
}

export const MyTest = () => {
  const [currentAnswer, setCurrentAnswer] = React.useState('');
  const [showResult, setShowResult] = React.useState(false);

  const rightAnswer = 'saturday';
  const options: Option[] = [
    { id: 'friday', value: 'Пятница' },
    { id: 'saturday', value: 'Суббота' },
    { id: 'monday', value: 'Пондельник :(' },
  ];

  return (
    <div style={{ padding: '4px 200px 200px 4px' }}>
      <h3>Какой сегодня день?</h3>
      <RadioGroup onValueChange={handleAnswerSelection}>
        <Gapped vertical gap={10}>
          {options.map((x: Option, index: number) => (
            <Radio
              data-tid={`option${index}`}
              key={x.id}
              value={x.id}
              error={showResult && currentAnswer === x.id && currentAnswer !== rightAnswer}
            >
              {x.value}
            </Radio>
          ))}
          <Button data-tid="checkButton" onClick={() => setShowResult(true)}>
            Проверить!
          </Button>
        </Gapped>
      </RadioGroup>
    </div>
  );

  function handleAnswerSelection(x: any) {
    setCurrentAnswer(x);
    setShowResult(false);
  }
};

/**
 *  MyTest. Проверяем, что правильный ответ не краснеет после нажатия проверки
 *
 *  0. История MyTest
 *  1. Найти элемент на странице
 *  2. 📸 дефолтное состояние
 *  3. выбрать вариант "Суббота"
 *  4. 📸 состояние “выбран вариант ответа”
 *  5. нажать кнопку "Проверить!"
 *  6. 📸 состояние “выбран правильный вариант ответа”
 */

MyTest.story = {
  parameters: {
    creevey: {
      tests: {
        async hover(this: { browser: WebDriver }) {
          // 1. находим элемент для скриншота
          const element = await this.browser.findElement({ css: '#test-element' });
          // находим кнопку
          const button = await this.browser.findElement({ css: 'button' });

          // 2. делаем скриншот "по умолчанию"
          const idle = await element.takeScreenshot();

          // 3. наводим указатель мыши
          await this.browser
            .actions({ bridge: true })
            .move({ origin: button })
            .perform();

          // 4. делаем скриншот "при наведении"
          const hover = await element.takeScreenshot();

          // 5. сравниваем результаты
          await expect({ idle, hover }).to.matchImages();
        },
      },
    },
  },
};