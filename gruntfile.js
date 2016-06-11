module.exports = function (grunt) {
    grunt.initConfig({
        pkgFile: 'package.json',
        clean: {
            default: ['build'],
            test: ['allure-results']
        },
        babel: {
            options: {
                sourceMap: false,
                optional: ['runtime']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: './lib',
                    src: ['**/*.js'],
                    dest: 'build',
                    ext: '.js'
                }]
            }
        },
        eslint: {
            options: {
                parser: 'babel-eslint'
            },
            target: ['lib/**/*.js', 'test/**/*.js']
        },
        contributors: {
            options: {
                commitMessage: 'update contributors'
            }
        },
        bump: {
            options: {
                commitMessage: 'v%VERSION%',
                pushTo: 'upstream'
            }
        },
        watch: {
            dist: {
                files: './lib/**/*.js',
                tasks: ['babel:dist']
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    quiet: false,
                    timeout: 8000
                },
                src: 'test/specs/*.js'
            }
        }
    })

    require('load-grunt-tasks')(grunt)
    grunt.registerTask('default', ['eslint', 'build', 'test'])
    grunt.registerTask('build', 'Build wdio-allure-reporter', function () {
        grunt.task.run([
            'clean',
            'babel'
        ])
    })
    grunt.registerTask('release', 'Bump and tag version', function (type) {
        grunt.task.run([
            'build',
            'contributors',
            'bump:' + (type || 'patch')
        ])
    })
    grunt.registerTask('test', 'Integration Tests', [
        'selenium_start',
        'mochaTest',
        'selenium_stop'
    ])
}
