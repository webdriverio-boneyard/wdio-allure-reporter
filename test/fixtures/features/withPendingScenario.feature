Feature: A Pending Scenario feature

    In order to successfully generate a report
    As a tester
    I want to run a pending scenario

    Scenario: A failing scenario
        Given I visit "/index.html"
        When I click the clickable region
        Then I run failing step

    Scenario: A Pending scenario
    Given I visit "/index.html"
    When I click the clickable region
    Then I run failing step