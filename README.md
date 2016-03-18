# braingames-slack
Push puzzles to slack channel

Короче, parse.js парсит сайт braingames и составляет список пазлов.
Ограничения: текст пазла не должен содержать сложную html-разметку, т.к. теги sup, sub и прочее в слаке не отобразить. 
В итоге получается файл data/braingames-puzzles-дата.js. Если там все норм, то его можно переименовать в braingames-puzzles.js и использовать этот файл как базу пазлов.

раотает по Outgoing WebHooks, POST /api/message в ответ на любое входящее сообщение (не забудьте настроить Trigger Word) дает задачку.
