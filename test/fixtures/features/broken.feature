Feature: A broken feature

    In order to successfully generate a report
    As a tester
    I want to run a broken scenario

    Scenario: A broken scenario
        Given I visit "/index.html"
        When I click the clickable region
        Then I try to use undefined step
