Feature: A passing feature

    In order to successfully generate a report
    As a tester
    I want to run a passing scenario

    Scenario: A passing scenario
        Given I visit "/index.html"
        Given I click the clickable region
        When I run failing step
        Then I see steps after as pending
