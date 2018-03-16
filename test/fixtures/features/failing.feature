Feature: A failing feature

    In order to successfully generate a report
    As a tester
    I want to run a failing scenario

    Scenario: A failing scenario
        Given I visit "/index.html"
        When I click the clickable region
        Then I run failing step
