import * as main from '../locators/main_page.json'
import * as result from '../locators/result_page.json'
import * as recovery from '../locators/recovery_password_page.json'
import * as logpass from '../helpers/default_data.json'

// Функция для генерации случайного "email"-like инпута
function generateRandomEmail(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result + '@test.com'; // гарантируем наличие @
}

describe('Тест-кейсы авторизации login.qa.studio', function() {
    beforeEach('Начало теста',function () {
    cy.visit('/') // переход на страницу логина
    cy.get(main.body).should('have.css', 'font-family', 'Finlandica, sans-serif') // проверка на соответствие шрифта в css body страницы
    cy.get(main.title).should('be.visible').contains('Форма логина')
    cy.get(main.forgot_pass_btn).should('be.visible').should('have.css', 'color', 'rgb(0, 85, 152)')
    cy.get(main.footer).should('be.visible')
  })
    afterEach('Конец теста',function () {
    cy.get(main.title).should('be.visible').contains('Форма логина')
  })
    it('Позитивный кейс авторизации с верными логином/паролем', function() {
    cy.get(main.email).should('be.visible').type(logpass.login) // вводим имя пользователя
    cy.get(main.password).should('be.visible').type(logpass.password) // вводим пароль
    cy.get(main.login_button).should('be.visible').click() // отправка формы
    cy.get(result.title).should('be.visible').contains('Авторизация прошла успешно')
    cy.get(result.close).should('be.visible').click()
  })


    it('Тест логики восстановления пароля', function() {
    const randomEmail = generateRandomEmail(8)
    cy.get(main.forgot_pass_btn).click()
    cy.get(recovery.title).should('be.visible').contains('Восстановите пароль')
    cy.get(recovery.footer).should('be.visible')
    cy.get(recovery.email).should('be.visible').type(randomEmail) // вводим имя пользователя
    cy.get(recovery.send_button).should('be.visible').click() // отправка формы
    cy.get(result.title).should('be.visible').contains('Успешно отправили пароль на e-mail')
    cy.get(result.close).should('be.visible').click()
  })
    it('Негативный кейс авторизации с верным логином/неверным паролем', function() {
    cy.get(main.email).should('be.visible').type(logpass.login) // вводим имя пользователя
    cy.get(main.password).should('be.visible').type('qa_one_love12') // вводим пароль
    cy.get(main.login_button).should('be.visible').click() // отправка формы
    cy.get(result.title).should('be.visible').contains('Такого логина или пароля нет')
    cy.get(result.close).should('be.visible').click()
  })
  it('Негативный кейс авторизации с неверным логином/верным паролем', function() {
    cy.get(main.email).should('be.visible').type('german@dolnikov.ru2') // вводим имя пользователя
    cy.get(main.password).should('be.visible').type(logpass.password) // вводим пароль
    cy.get(main.login_button).should('be.visible').click() // отправка формы
    cy.get(result.title).should('be.visible').contains('Такого логина или пароля нет')
    cy.get(result.close).should('be.visible').click()
  })
  it('Негативный кейс на проверку валидации', function() {
    cy.get(main.email).should('be.visible').type('germandolnikov.ru') // вводим имя пользователя
    cy.get(main.password).should('be.visible').type(logpass.password) // вводим пароль
    cy.get(main.login_button).should('be.visible').click() // отправка формы
    cy.get(result.title).should('be.visible').contains('Нужно исправить проблему валидации')
    cy.get(result.close).should('be.visible').click()
  })
  it('Тест-кейс на приведение верхнего регистра к нижнему', function() {
    cy.get(main.email).should('be.visible').type('GerMan@Dolnikov.ru') // вводим имя пользователя
    cy.get(main.password).should('be.visible').type(logpass.password) // вводим пароль
    cy.get(main.login_button).should('be.visible').click() // отправка формы
    cy.get(result.title).should('be.visible').contains('Авторизация прошла успешно') // тест провален, что и ожидалось
    cy.get(result.close).should('be.visible').click()
  })
})