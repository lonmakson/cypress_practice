describe('End-to-end тест-кейс покупки аватара на сайте pokemonbattle.ru', function() {
    it('Позитивный кейс авторизации с верными логином/паролем', function () {
        cy.visit('https://pokemonbattle.ru/')
        cy.intercept('GET', 'https://api.pokemonbattle.ru/v2/technical_routes/get_options').as('get_options')
        cy.wait('@get_options') // ждем загрузки страницы авторизации
        cy.get('#k_email').should('be.visible').type('user_login') // вводим логин
        cy.get('#k_password').should('be.visible').type('user_password') // вводим пароль
        cy.get('.MuiButton-root').should('be.visible').click()

        cy.intercept('GET','https://api.pokemonbattle.ru/v2/pokemons?sort=asc_date&status=1&page=1').as('get_pokemons')
        cy.wait('@get_pokemons') // ждем ответ бэкенда на GET-метод - получение списка покемонов
        cy.get('.header_card_trainer').should('be.visible').click()

        cy.intercept('POST','https://api.pokemonbattle.ru/v2/technical_routes/single_trainer_data').as('post_trainer')
        cy.wait('@post_trainer') // ждем ответ бэкенда на POST-метод
        cy.get('[data-qa="shop"]').should('be.visible').click() // переходим в магазин с аватарами

        cy.intercept('GET','https://api.pokemonbattle.ru/v2/debug_menu/get_avatars').as('get_avatars')
        cy.wait('@get_avatars') // ждем ответ бэкенда на GET-метод на получение списка аватаров

        cy.get('section.shop li.shop__item:not(.feature-empty):visible')/* здесь мы исключаем empty аватар*/.then($items => {
const i = Cypress._.random(0, $items.length - 1)
cy.wrap($items.eq(i)).within(() => {
cy.contains('Купить').click()
})
}) // этот блок отвечает за рандомную выборку аватара

        cy.get('.payment_form_card_form > :nth-child(2) > .style_1_base_input').should('be.visible').type('5318093235078830') // вводим номер карты
        cy.get(':nth-child(1) > .style_1_base_input').should('be.visible').type('11/32') // вводим срок действия карты
        cy.get('.payment_form_card_form_inputs > :nth-child(2) > .style_1_base_input').should('be.visible').type('125') // cvv
        cy.get('.payment_form_card_form_input_last > .style_1_base_input').should('be.visible').type('user name') // имя фамилия
        cy.get('.style_1_base_button_payment_body > .style_1_base_button_payment').should('be.visible').click()
        cy.get('.style_1_base_input').should('be.visible').type('56456') // секретный код
        cy.get('.style_1_base_button_payment_body > .style_1_base_button_payment').should('be.visible').click()
        cy.get('.payment_status_top_title').should('be.visible').contains('Покупка прошла успешно') // с обновкой 🗿
        cy.get('.payment_status_back').should('be.visible').click()
        cy.get('.pokemon__title').should('be.visible').contains('Магазин')
    })
})