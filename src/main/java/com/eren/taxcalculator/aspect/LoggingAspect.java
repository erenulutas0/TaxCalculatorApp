package com.eren.taxcalculator.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.util.Arrays;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    // Pointcut for all public methods in service layer
    @Pointcut("execution(public * com.eren.taxcalculator.service..*.*(..))")
    public void serviceLayerExecution() {}

    // Pointcut for all public methods in controller layer
    @Pointcut("execution(public * com.eren.taxcalculator.controller..*.*(..))")
    public void controllerLayerExecution() {}

    // Combined pointcut covering both service and controller layers
    @Pointcut("serviceLayerExecution() || controllerLayerExecution()")
    public void applicationExecution() {}

    // Log before method execution
    @Before("applicationExecution()")
    public void logBefore(JoinPoint joinPoint) {
        logger.info("==> Enter: {}.{}() with argument[s] = {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                Arrays.toString(joinPoint.getArgs()));
    }

    // Log after successful method completion
    @AfterReturning(pointcut = "applicationExecution()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        logger.info("<== Exit: {}.{}() with result = {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                result);
    }

    // Log when method throws exception
    @AfterThrowing(pointcut = "applicationExecution()", throwing = "exception")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable exception) {
        logger.error("!!! Exception in {}.{}() with cause = '{}' and exception = '{}'",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                exception.getCause() != null ? exception.getCause() : "NULL",
                exception.getMessage(),
                exception); // Include stack trace in logs
    }

    // Method execution time measurement using @Around advice
    @Around("applicationExecution()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        logger.debug(">>> Around: Entering {}.{}()", joinPoint.getSignature().getDeclaringTypeName(), joinPoint.getSignature().getName());

        Object result;
        try {
            result = joinPoint.proceed(); // Execute target method
        } catch (Throwable throwable) {
            logger.error("!!! Around: Exception in {}.{}()", joinPoint.getSignature().getDeclaringTypeName(), joinPoint.getSignature().getName(), throwable);
            throw throwable; // Re-throw exception
        } finally {
            stopWatch.stop();
            logger.debug("<<< Around: Exiting {}.{}(); Execution time: {} ms",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(),
                    stopWatch.getTotalTimeMillis());
        }
        return result;
    }

    @Pointcut("execution(* com.eren.taxcalculator.controller.*.*(..))")
    public void controllerMethods() {}

    @Around("controllerMethods()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        logger.info("Method {} called with arguments: {}",
                joinPoint.getSignature().getName(),
                Arrays.toString(joinPoint.getArgs()));

        try {
            Object result = joinPoint.proceed();
            stopWatch.stop();
            logger.info("Method {} executed in {} ms",
                    joinPoint.getSignature().getName(),
                    stopWatch.getTotalTimeMillis());
            return result;
        } catch (Exception e) {
            stopWatch.stop();
            logger.error("Method {} failed after {} ms with error: {}",
                    joinPoint.getSignature().getName(),
                    stopWatch.getTotalTimeMillis(),
                    e.getMessage());
            throw e;
        }
    }
}